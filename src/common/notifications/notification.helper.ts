// import { Injectable, Inject, forwardRef } from '@nestjs/common';
// import { WebsocketService } from '../../websocket/websocket.service';

// // ADMIN notifications
// export enum EAdminNotification {
//   USER_REGISTERED = ' New user registered',
//   USER_LOGIN = 'User login',
// }

// // PROJECT MANAGER notifications
// export enum EManagerNotification {
//   PROJECT_CREATED = 'New Project created',
//   PROJECT_UPDATED = 'Project updated',
//   PROJECT_DELETED = 'Project deleted',
//   PROJECT_STATUS_CHANGED = 'Project status change',
// }

// // MEMBER notifications
// export enum EMemberNotification {
//   TASK_ASSIGNED = ' Task assigned',
//   TASK_STATUS_UPDATED = ' Task status updated',
//   TASK_DELETED = 'Task deleted',
// }

// export type ENotificationType =
//   | EAdminNotification
//   | EManagerNotification
//   | EMemberNotification;

// @Injectable()
// export class NotificationHelper {
//   constructor(
//     @Inject(forwardRef(() => WebsocketService))
//     private readonly websocket: WebsocketService,
//   ) {}

//   async notify(
//     userId: number,
//     type: ENotificationType,
//     message: string,
//     extra?: Record<string, unknown>,
//   ): Promise<void> {
//     await this.websocket.publishNotification(userId, {
//       notification_type: type,
//       message,
//       created_at: new Date().toISOString(),
//       ...extra,
//     });
//   }

//   // ── Admin ────────────────────────────────────────────
//   async notifyAdmins(
//     adminId: number,
//     type: EAdminNotification,
//     message: string,
//     extra?: Record<string, unknown>,
//   ): Promise<void> {
//     // await Promise.all(
//     // adminIds.map((id) => this.notify(id, type, message, extra)),
//     await this.notify(adminId, type, message, extra);
//     // );
//   }

//   // ── Manager ──────────────────────────────────────────
//   async notifyManager(
//     managerId: number,
//     type: EManagerNotification,
//     message: string,
//     extra?: Record<string, unknown>,
//   ): Promise<void> {
//     await this.notify(managerId, type, message, extra);
//   }

//   // ── Member ───────────────────────────────────────────
//   async notifyMember(
//     memberId: number,
//     type: EMemberNotification,
//     message: string,
//     extra?: Record<string, unknown>,
//   ): Promise<void> {
//     await this.notify(memberId, type, message, extra);
//   }
// }

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsocketService } from '../../websocket/websocket.service';
import { User } from '../../common/entities/user.entity';
import { EUserRole } from '../../common/enums/enum';

// ADMIN notifications
export enum EAdminNotification {
  USER_REGISTERED = 'New user registered',
  USER_LOGIN = 'User login',
}

// PROJECT MANAGER notifications
export enum EManagerNotification {
  PROJECT_CREATED = 'New Project created',
  PROJECT_UPDATED = 'Project updated',
  PROJECT_DELETED = 'Project deleted',
  PROJECT_STATUS_CHANGED = 'Project status change',
  TASK_CREATED = 'Task created', // ← add: managers care about tasks too
  TASK_STATUS_CHANGED = 'Task status changed',
  TASK_DELETED = 'Task deleted',
}

// MEMBER notifications
export enum EMemberNotification {
  TASK_ASSIGNED = 'Task assigned',
  TASK_STATUS_UPDATED = 'Task status updated',
  TASK_DELETED = 'Task deleted',
}

export type ENotificationType =
  | EAdminNotification
  | EManagerNotification
  | EMemberNotification;

@Injectable()
export class NotificationHelper {
  constructor(
    @Inject(forwardRef(() => WebsocketService))
    private readonly websocket: WebsocketService,

    @InjectRepository(User, 'main_repo') // adjust connection name to match your setup
    private readonly userRepo: Repository<User>,
  ) {}

  async notify(
    userId: number,
    type: ENotificationType,
    message: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    await this.websocket.publishNotification(userId, {
      notification_type: type,
      message,
      created_at: new Date().toISOString(),
      ...extra,
    });
  }

  // ── Admin (broadcast to every admin) ──────────────────
  async notifyAdmins(
    type: EAdminNotification,
    message: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    const admins = await this.userRepo.find({
      where: { role: EUserRole.ADMIN },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) => this.notify(admin.id, type, message, extra)),
    );
  }

  // ── Manager ──────────────────────────────────────────
  async notifyManager(
    managerId: number,
    type: EManagerNotification,
    message: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    await this.notify(managerId, type, message, extra);
  }

  // ── Member ───────────────────────────────────────────
  async notifyMember(
    memberId: number,
    type: EMemberNotification,
    message: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    await this.notify(memberId, type, message, extra);
  }
}
