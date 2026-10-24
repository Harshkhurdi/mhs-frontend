// SDK callbacks and sign-in stay behind the persistence migration barrier.
export function watchStaffSession({ ready, subscribe, clear, approved, changed, failed }) {
  let active = true, unsubscribe = () => {}
  ready.then(() => {
    if (!active) return
    unsubscribe = subscribe(value => {
      if (!active) return
      const staff = approved(value) ? value : null
      changed(staff)
      if (value && !staff) clear().catch(() => {})
    }, () => { if (active) failed() })
  }).catch(() => {
    if (active) failed()
    clear().catch(() => {})
  })
  return () => { active = false; unsubscribe() }
}
export async function signInStaff({ ready, signIn, clear, approved }, email, password) {
  await ready
  const credentials = await signIn(email, password)
  if (!approved(credentials.user)) {
    try { await clear() } catch { /* UID authorization stays denied. */ }
    const error = new Error('This account is not approved for staff access.')
    error.code = 'auth/staff-access-denied'
    throw error
  }
  return credentials
}
