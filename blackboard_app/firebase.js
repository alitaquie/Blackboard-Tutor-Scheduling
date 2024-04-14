// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPWJQdZePfzjpRlRtMT_gY3HktQvqizAw",
  authDomain: "blackboard-41f8a.firebaseapp.com",
  projectId: "blackboard-41f8a",
  storageBucket: "blackboard-41f8a.appspot.com",
  messagingSenderId: "52140658788",
  appId: "1:52140658788:web:46a71eb9e5a26e86ce0f71",
  measurementId: "G-W7BR765CXM"
};

// Initialize Firebase
let app;
if (firebase.apps.length == 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}
const auth = firebase.auth()

export { app, auth };