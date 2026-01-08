const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "sainidaksh70@gmail.com";

export function isAdmin(user) {
  return user && user.email === SUPER_ADMIN_EMAIL;
}

export function isSuperAdmin(user) {
  return isAdmin(user);
}

export async function requireAdmin(user) {
  if (!isAdmin(user)) {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function requireSuperAdmin(user) {
  return requireAdmin(user);
}
