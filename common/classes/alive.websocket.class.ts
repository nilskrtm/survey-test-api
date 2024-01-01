import { WebSocket } from 'ws';
import { SubscriptionData } from '../interfaces/websocket.data.inteface';

type WebSocketMeta = {
  connectionId: string;
  userId: string;
};

declare class AliveWebSocket extends WebSocket {
  isAlive: boolean;
  meta: WebSocketMeta;
  subscriptions: Map<string, SubscriptionData>;
}

export { AliveWebSocket, WebSocketMeta };
