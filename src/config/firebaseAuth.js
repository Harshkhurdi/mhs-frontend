import { browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth'
import { app } from './firebaseClient'

export const auth = app ? getAuth(app) : null
// Wait for restored local tokens to migrate to this tab before staff access.
export const authReady = auth ? setPersistence(auth, browserSessionPersistence) : Promise.resolve()
// AuthProvider observes the original rejection and fails closed.
authReady.catch(() => {})
