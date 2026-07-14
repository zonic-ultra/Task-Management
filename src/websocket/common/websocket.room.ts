export function userRoom(userId: string | number): string {
  return `user:${userId}`;
}

export function managerRoom(managerId: string | number): string {
  return `manager:${managerId}`;
}

export function adminRoom(adminId: string | number): string {
  return `admin:${adminId}`;
}
