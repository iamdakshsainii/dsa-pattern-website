import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Create JWT token
export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
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

// Get current user from cookies (server-side)
export async function getCurrentUser() {
  try {
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

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
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
