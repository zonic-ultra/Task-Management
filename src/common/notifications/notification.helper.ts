import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { WebsocketService } from '../../websocket/websocket.service';

// ADMIN notifications
export enum EAdminNotification {
  USER_REGISTERED = ' New user registered',
  USER_LOGIN = 'User login',
}

// PROJECT MANAGER notifications
export enum EManagerNotification {
  PROJECT_CREATED = 'New Project created',
  PROJECT_UPDATED = 'Project updated',
  PROJECT_DELETED = 'Project deleted',
  PROJECT_STATUS_CHANGED = 'Project status change',
}

// MEMBER notifications
export enum EMemberNotification {
  TASK_ASSIGNED = ' Task assigned',
  TASK_STATUS_UPDATED = ' Task status updated',
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
