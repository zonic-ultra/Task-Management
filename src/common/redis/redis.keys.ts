const env = () => process.env.STAGE ?? 'dev';

export const userKey = (id: string | number) =>
  `${env()}:tm:user:${id}`;

export const sessionKey = (id: string | number) =>
  `${env()}:tm:session:${id}`;

export const userPermissionsKey = (id: string | number) =>
  `${env()}:tm:user:${id}:permissions`;

export const projectKey = (id: string | number) =>
  `${env()}:tm:project:${id}`;

export const projectsByOwnerKey = (owner_id: string | number) =>
  `${env()}:tm:projects:owner:${owner_id}`;

export const taskKey = (id: string | number) =>
  `${env()}:tm:task:${id}`;

export const tasksByProjectKey = (project_id: string | number) =>
  `${env()}:tm:tasks:project:${project_id}`;

export const tasksByAssigneeKey = (assignee_id: string | number) =>
  `${env()}:tm:tasks:assignee:${assignee_id}`;

export const usersKey = () => `${env()}:tm:users`;

export const userNotificationKey = (userId: number | string) =>
  `${env()}:tm:notifications:${userId}`;

export const readNotificationKey = (userId: number | string) =>
  `${env()}:tm:notifications:read:${userId}`;

export const unreadNotificationKey = (userId: number | string) =>
  `${env()}:tm:notifications:unread:${userId}`;
