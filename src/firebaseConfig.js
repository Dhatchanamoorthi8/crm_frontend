// firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBc9W6F6m58Urd5GFL8GDkqVEzSQULq9jA',
  authDomain: 'angularapi-ed75f.firebaseapp.com',
  databaseURL: 'https://angularapi-ed75f-default-rtdb.firebaseio.com',
  projectId: 'angularapi-ed75f',
  storageBucket: 'angularapi-ed75f.appspot.com',
  messagingSenderId: '827563786719',
  appId: '1:827563786719:web:8e5fa012186c1141adc46a',
  measurementId: 'G-14WFV0VSPL'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
