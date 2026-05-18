import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyADiA3BpjLoZZP2XRl4xh0sXEPNeeM-eUk",
  authDomain: "tasj-nabager.firebaseapp.com",
  projectId: "tasj-nabager",
  storageBucket: "tasj-nabager.firebasestorage.app",
  messagingSenderId: "1032039185072",
  appId: "1:1032039185072:web:ac1e2527c1a472be0e5975"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
