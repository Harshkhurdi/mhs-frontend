import { getFirestore } from 'firebase/firestore/lite'
import { app } from './firebaseClient'

export const db = app ? getFirestore(app) : null
