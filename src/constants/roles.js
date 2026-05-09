export const USER_ROLES = {
  customer: 'customer',
  employee: 'employee',
  admin: 'admin',
}
export function canAccessStaff(role) {
  return role === USER_ROLES.employee || role === USER_ROLES.admin
}
export function canAccessAdmin(role) {
  return role === USER_ROLES.admin
}
