export function userName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Unnamed user'
}
export function userInitials(user) {
  return userName(user).split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()
}
export function userStatus(user) {
  return ({ 1: 'Active', 2: 'Inactive', 3: 'Suspended', 4: 'Deleted' })[user.status_id] || 'Unknown'
}
