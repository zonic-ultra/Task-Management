import { Module, forwardRef } from '@nestjs/common';
import { WebsocketGateway } from './websocket.getway';
import { WebsocketService } from './websocket.service';
import { AuthModule } from '../modules/auth/auth.module';
import { RedisPubSub } from '../common/redis/redis.pubsub.service';
import { NotificationHelper } from '../common/notifications/notification.helper';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [WebsocketGateway, WebsocketService, RedisPubSub, NotificationHelper],
  exports: [WebsocketService, RedisPubSub, NotificationHelper],
})
export class WebsocketModule {}
