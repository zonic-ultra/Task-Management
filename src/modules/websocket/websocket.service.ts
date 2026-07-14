import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketService {
  constructor(private readonly gateway: WebsocketGateway) {}

  broadcast(event: string, data: unknown) {
    this.gateway.broadcast(event, data);
  }

  broadcastToRoom(room: string, event: string, data: unknown) {
    this.gateway.broadcastToRoom(room, event, data);
  }
}
