export enum RoleType {
  ADMIN = 1,
  USER = 2,
  MODERATOR = 3,
}

export const RoleNames: Record<RoleType, string> = {
  [RoleType.ADMIN]: 'admin',
  [RoleType.USER]: 'user',
  [RoleType.MODERATOR]: 'moderator',
};

export const DEFAULT_ROLE_ID = RoleType.USER;
