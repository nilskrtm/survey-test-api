import debug from 'debug';
import { Server, WebSocketServer } from 'ws';
import * as http from 'http';
import jwt from 'jsonwebtoken';
import { Jwt } from '../types/jwt.type';
import { AliveWebSocket } from '../classes/alive.websocket.class';

const log: debug.IDebugger = debug('app:ws-service');

const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || 'accessToken';

class WebSocketService {
  server: http.Server;
  wss: Server<typeof AliveWebSocket, typeof http.IncomingMessage>;

  constructor() {
    this.server = http.createServer();
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

    this.setup();
  }

  start() {
    log('Starting WebSocket-Server');

    const port: number = parseInt(process.env.WEBSOCKET_PORT || '8080');

    this.server.listen(port, async () => {
      log(`Web-Socket Server running on port ${port}`);

      this.startHeartbeat();
    });
  }

  setup() {
    const onSocketError = (error: any) => {
      log(error);
    };

    this.server.on('upgrade', (req, socket, head) => {
      socket.on('error', onSocketError);

      let userId: string;

      if (req.headers['authorization']) {
        try {
          const authorization = req.headers['authorization'].split(' ');

          if (authorization[0] !== 'Bearer') {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();

            return;
          } else {
            userId = (jwt.verify(authorization[1], accessTokenSecret) as Jwt)
              .userId as string;
          }
        } catch (err) {
          socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
          socket.destroy();

          return;
        }
      } else {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();

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

        log('new connection: ' + userId);
        // TODO: onConnection - userId

        ws.on('pong', (pWs: AliveWebSocket) => {
          pWs.isAlive = true;
          ws.isAlive = true;
        });

        ws.on('error', error => {
          log(error);
        });

        ws.on('close', () => {
          log('closed connection: ' + userId);
          // TODO: onClose - userId
        });

        ws.on('message', data => {
          log('received: %s', data);
          // TODO: onMessage - data
        });
      },
    );
  }

  startHeartbeat() {
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
}

export default new WebSocketService();
