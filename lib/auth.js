import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

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
  return jwt.sign(
    {
      userId: payload.userId || payload.id,
      id: payload.userId || payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    const userId = decoded.userId || decoded.id || decoded.sub

    if (!userId) {
      console.error('❌ No user ID found in token:', decoded)
      return null
    }

    return {
      id: userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch (error) {
    console.error('❌ Token verification error:', error.message)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')

    if (!authToken) {
      console.log('ℹ️ No auth token found in cookies')
      return null
    }

    console.log('🔍 Auth token found, verifying...')
    const payload = verifyToken(authToken.value)

    if (!payload) {
      console.log('❌ Token verification failed')
      return null
    }

    console.log('✅ User authenticated:', payload.id, payload.email)
    return payload
  } catch (error) {
    console.error('❌ Get current user error:', error)
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

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'sainidaksh70@gmail.com'

export function isSuperAdmin(user) {
  return user && user.email === SUPER_ADMIN_EMAIL
}

export async function requireAdmin(user) {
  if (!isSuperAdmin(user)) {
    throw new Error('Unauthorized: Admin access required')
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
