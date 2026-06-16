import { EMemberRole } from '../enums/enum';

// member-response.dto.ts
export class MemberResponseDto {
  id: number;
  project_id: number;
  name: string;
  role: EMemberRole;
  joined_at: Date;
}
