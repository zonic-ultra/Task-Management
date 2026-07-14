export class GetNotificationsDto {
  limit: number;

  stream_id: string;
}

export class ReadNotificationDto {
  stream_id: string[];
}

export class UnreadNotificationDto {
  stream_id: string[];
}

export class DeleteNotificationDto {
  stream_id: string[];
}
