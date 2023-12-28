import { WebSocket } from 'ws';

declare class AliveWebSocket extends WebSocket {
  isAlive: boolean;
}

export { AliveWebSocket };
