import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import {
  DeleteNotificationDto,
  GetNotificationsDto,
  ReadNotificationDto,
  UnreadNotificationDto,
} from './common/websocket.dto';
import { WebsocketService } from './websocket.service';

@UsePipes(new ValidationPipe({ transform: true }))
// @WebSocketGateway({ namespace: 'tasks-notifications', cors: { origin: '*' } })

@WebSocketGateway({
  namespace: '/tasks-notifications',
  cors: {
    // origin: ['https://tasks-tracker-kappa.vercel.app', 'http://localhost:3000'],
    origin: '*',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.websocketService.setServer(server);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.websocketService.handleConnection(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.websocketService.handleDisconnect(client);
  }

  @SubscribeMessage('event:count:notifications')
  getNotificationsCount(@ConnectedSocket() client: Socket) {
    return this.websocketService.getNotificationsCount(client);
  }

  @SubscribeMessage('event:get:notifications')
  getNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: GetNotificationsDto,
  ) {
    return this.websocketService.getNotifications(client, dto);
  }

  @SubscribeMessage('event:read:notification')
  readNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: ReadNotificationDto,
  ) {
    return this.websocketService.readNotification(client, dto);
  }

  @SubscribeMessage('event:read-all:notification')
  readAllNotifications(@ConnectedSocket() client: Socket) {
    return this.websocketService.readAllNotifications(client);
  }

  @SubscribeMessage('event:unread:notification')
  unreadNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: UnreadNotificationDto,
  ) {
    return this.websocketService.unreadNotification(client, dto);
  }

  @SubscribeMessage('event:unread-all:notification')
  unreadAllNotifications(@ConnectedSocket() client: Socket) {
    return this.websocketService.unreadAllNotifications(client);
  }

  @SubscribeMessage('event:delete:notification')
  deleteNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: DeleteNotificationDto,
  ) {
    return this.websocketService.deleteNotification(client, dto);
  }
}
