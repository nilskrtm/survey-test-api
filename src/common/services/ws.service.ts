import debug from 'debug';
import { Server, WebSocketServer } from 'ws';
import * as http from 'http';
import jwt from 'jsonwebtoken';
import { Jwt } from '../types/jwt.type';
import { AliveWebSocket } from '../classes/alive.websocket.class';
import {
  SubscriptionData,
  SubscriptionType,
  WebSocketData,
  WebSocketDataType,
} from '../interfaces/websocket.data.inteface';
import { v4 as uuid } from 'uuid';
import stream from 'node:stream';

const log: debug.IDebugger = debug('app:ws-service');

const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || 'accessToken';

class WebSocketService {
  private server: http.Server;
  private wss: Server<typeof AliveWebSocket, typeof http.IncomingMessage>;

  constructor() {
    this.server = http.createServer(); // create dummy server
    this.wss = new WebSocketServer<
      typeof AliveWebSocket,
      typeof http.IncomingMessage
    >({
      noServer: true,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024, // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
      },
    });
  }

  public setup(server: http.Server) {
    this.server = server;

    const onSocketError = (error: any) => {
      log(error);
    };

    this.server.on('upgrade', (req, socket, head) => {
      socket.on('error', onSocketError);

      let userId: string;

      if (req.url && req.url.startsWith('/?accessToken=')) {
        try {
          const authorization = req.url.replace('/?accessToken=', '');

          userId = (jwt.verify(authorization, accessTokenSecret) as Jwt)
            .userId as string;
        } catch (err) {
          this.closeSocket(socket, 401);

          return;
        }
      } else {
        this.closeSocket(socket, 400);

        return;
      }

      socket.removeListener('error', onSocketError);

      this.wss.handleUpgrade(req, socket, head, (ws, pReq) => {
        this.wss.emit('connection', ws, pReq, userId);
      });
    });

    this.wss.on(
      'connection',
      (ws: AliveWebSocket, req: http.IncomingMessage, userId: string) => {
        ws.isAlive = true;
        ws.meta = { connectionId: uuid(), userId: userId };
        ws.subscriptions = new Map<string, SubscriptionData>();

        log('New WebSocket connection:');
        log(ws.meta);

        ws.on('pong', (pWs: AliveWebSocket) => {
          pWs.isAlive = true; // somehow not working
          ws.isAlive = true;
        });

        ws.on('error', error => {
          log(error);
        });

        ws.on('close', () => {
          ws.subscriptions.forEach(subscription => {
            log('Unregistered Subscription:');
            log(subscription);
          });

          ws.subscriptions.clear();

          log('Closed WebSocket connection:');
          log(ws.meta);
        });

        ws.on('message', rawData => {
          const data: WebSocketData = JSON.parse(rawData.toString());

          if (data.type === WebSocketDataType.SUBSCRIPTION_REQUEST) {
            const subscriptionData = data as WebSocketData<SubscriptionData>;
            const confirmSubscriptionData: WebSocketData<SubscriptionData> = {
              type: WebSocketDataType.SUBSCRIPTION_CONFIRMATION,
              data: subscriptionData.data,
            };

            ws.subscriptions.set(
              subscriptionData.data.subscriptionId,
              subscriptionData.data,
            );
            ws.send(JSON.stringify(confirmSubscriptionData));

            log('Registered Subscription:');
            log(JSON.stringify(subscriptionData.data));
          } else if (data.type === WebSocketDataType.SUBSCRIPTION_REMOVE) {
            const subscriptionData = data as WebSocketData<SubscriptionData>;

            if (ws.subscriptions.has(subscriptionData.data.subscriptionId)) {
              ws.subscriptions.delete(subscriptionData.data.subscriptionId);

              log('Unregistered Subscription:');
              log(JSON.stringify(subscriptionData.data));
            } else {
              log('Received unsubscribe for non-registered subscription');
            }
          }
        });
      },
    );
  }

  public startHeartbeat() {
    const aliveInterval = setInterval(() => {
      Array.from(this.wss.clients).forEach(ws => {
        if (!ws.isAlive) {
          ws.terminate();
        } else {
          ws.isAlive = false;

          ws.ping();
        }
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(aliveInterval);
    });
  }

  private closeSocket(socket: stream.Duplex, code: number) {
    switch (code) {
      case 400:
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        break;
      case 401:
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        break;
      case 403:
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        break;
      default:
        socket.destroy();
    }
  }

  private getClientByID(connectionId: string) {
    return Array.from(this.wss.clients).filter(
      ws => ws.meta.connectionId === connectionId,
    )[0];
  }

  private getClientsByUserID(userId: string) {
    return Array.from(this.wss.clients).filter(ws => ws.meta.userId === userId);
  }

  public notifySubscriptions<T>(
    userId: string,
    subscriptionType: SubscriptionType,
    payload?: T,
  ) {
    const clients = this.getClientsByUserID(userId);

    clients.forEach(ws => {
      const subscriptions = ws.subscriptions;

      subscriptions.forEach(subscription => {
        if (subscription.subscriptionType === subscriptionType) {
          const data: WebSocketData<SubscriptionData<T>> = {
            type: WebSocketDataType.SUBSCRIPTION_PAYLOAD,
            data: {
              subscriberId: subscription.subscriberId,
              subscriptionId: subscription.subscriptionId,
              subscriptionType: subscription.subscriptionType,
              payload: payload,
            },
          };

          this.send(ws, data);
        }
      });
    });
  }

  public send(ws: AliveWebSocket, data: WebSocketData) {
    ws.send(JSON.stringify(data));
  }
}

export default new WebSocketService();
