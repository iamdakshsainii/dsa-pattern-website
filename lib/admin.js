// Admin authorization
const ADMIN_EMAIL = "sainidaksh70@gmail.com"

export function isAdmin(user) {
  return user && user.email === ADMIN_EMAIL
}

export async function requireAdmin(user) {
  if (!isAdmin(user)) {
    throw new Error("Unauthorized: Admin access required")
  }
}
