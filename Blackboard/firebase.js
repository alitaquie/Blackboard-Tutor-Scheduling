// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
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
  appId: "1:52140658788:web:984fc2d26a39c6b8ce0f71",
  measurementId: "G-Q8L0TWFE8J"
};

// Initialize Firebase
let app;
if (firebase.getApps.length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}
const analytics = getAnalytics(app);
const auth = firebase.auth();

export {auth};