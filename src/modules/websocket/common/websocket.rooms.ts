export function adminRoom(orgId: number | string) {
  return `admin_room:${orgId}`;
}

export function userRoom(memberId: number | string) {
  return `user_room:${memberId}`;
}
