import firebase from 'firebase/app';
import 'firebase/database';
// import 'firebase/auth'
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCrrl1USiyPSLKZNaOf1Shl0qBXGBaog7s",
    authDomain: "safe-vault-with-tokens.firebaseapp.com",
    databaseURL: "https://safe-vault-with-tokens.firebaseio.com",
    projectId: "safe-vault-with-tokens",
    storageBucket: "safe-vault-with-tokens.appspot.com",
    messagingSenderId: "275909905268"
  };
  firebase.initializeApp(config);

  export const db = firebase.database();
  export const auth = firebase.auth(); 
  export const storage = firebase.storage(); 


