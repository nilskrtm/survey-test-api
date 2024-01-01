import { WebSocket } from 'ws';

type WebSocketMeta = {
  connectionId: string;
  userId: string;
};

declare class AliveWebSocket extends WebSocket {
  isAlive: boolean;
  meta: WebSocketMeta;
  subscriptions: Map<string, string>;
}

export { AliveWebSocket, WebSocketMeta };
