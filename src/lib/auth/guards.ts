import { requireRole } from './session'

export function requireCustomer() {
  return requireRole(['user'], '/account/login')
}

export function requireStaff() {
  return requireRole(['staff', 'admin'], '/console/login')
}

export function requireAdmin() {
  return requireRole(['admin'], '/console/login')
}