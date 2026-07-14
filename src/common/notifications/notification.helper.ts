import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { WebsocketService } from '../../websocket/websocket.service';

// ADMIN notifications
export enum EAdminNotification {
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
}

// PROJECT MANAGER notifications
export enum EManagerNotification {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  PROJECT_STATUS_CHANGED = 'PROJECT_STATUS_CHANGED',
}

// MEMBER notifications
export enum EMemberNotification {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_STATUS_UPDATED = 'TASK_STATUS_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
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

  // ── Admin ────────────────────────────────────────────
  async notifyAdmins(
    adminIds: number[],
    type: EAdminNotification,
    message: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    await Promise.all(
      adminIds.map((id) => this.notify(id, type, message, extra)),
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
