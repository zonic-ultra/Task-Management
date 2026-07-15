import { Module, forwardRef } from '@nestjs/common';
import { WebsocketGateway } from './websocket.getway';
import { WebsocketService } from './websocket.service';
import { AuthModule } from '../modules/auth/auth.module';
import { RedisPubSub } from '../common/redis/redis.pubsub.service';
import { NotificationHelper } from '../common/notifications/notification.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User], 'main_repo'),
  ],
  providers: [
    WebsocketGateway,
    WebsocketService,
    RedisPubSub,
    NotificationHelper,
  ],
  exports: [WebsocketService, RedisPubSub, NotificationHelper],
})
export class WebsocketModule {}
