export const PERMISSIONS = {
  USERS_VIEW: 'users.view',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_BLOCK: 'users.block',
  USERS_ATTEMPTS: 'users.attempts',
  MENTORSHIP_VIEW: 'mentorship.view',
  MENTORSHIP_REPLY: 'mentorship.reply',
  CONTENT_VIEW: 'content.view',
  CONTENT_EDIT: 'content.edit',
  CONTENT_DELETE: 'content.delete',
  ANALYTICS_VIEW: 'analytics.view',
  ROLES_MANAGE: 'roles.manage',
  SETTINGS_MANAGE: 'settings.manage'
};

export const ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: Object.values(PERMISSIONS)
  }
};

export function hasPermission(user, permission) {
  const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'sainidaksh70@gmail.com';
  return user && user.email === SUPER_ADMIN_EMAIL;
}

export function checkPermission(user, permission) {
  if (!hasPermission(user, permission)) {
    throw new Error(`Unauthorized: Missing permission ${permission}`);
  }
  return true;
}
