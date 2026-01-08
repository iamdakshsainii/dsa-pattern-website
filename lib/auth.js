// lib/auth.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name,
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    const authToken = cookieStore.get('auth-token')

    if (!authToken) {
      return null
    }

    const payload = verifyToken(authToken.value)
    return payload
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password) {
  const errors = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'sainidaksh70@gmail.com';

export function isSuperAdmin(user) {
  return user && user.email === SUPER_ADMIN_EMAIL;
}

export async function requireAdmin(user) {
  if (!isSuperAdmin(user)) {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
