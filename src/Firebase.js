import firebase from 'firebase'

/* CONFIGURATION FOR THE FIREBASE ANALYTICS AND CONNECTION */
var firebaseConfig = {
  apiKey: 'AIzaSyDXHZJQ24Dv4RYvyUR7ViqvDtrp3rDKlAA',
  authDomain: 'sportocoplayalong.firebaseapp.com',
  projectId: 'sportocoplayalong',
  storageBucket: 'sportocoplayalong.appspot.com',
  messagingSenderId: '467185708403',
  appId: '1:467185708403:web:9862d3ab612657c4722906',
  measurementId: 'G-CCZQ3N1HY8',
}

firebase.initializeApp(firebaseConfig)
var auth = firebase.auth()
var googleProvider = new firebase.auth.GoogleAuthProvider()
var facebookAuthProvider = new firebase.auth.FacebookAuthProvider()
var appleAuthProvider = new firebase.auth.OAuthProvider('apple.com')
let analytics = firebase.analytics()
export {
  auth,
  googleProvider,
  facebookAuthProvider,
  appleAuthProvider,
  analytics,
}
