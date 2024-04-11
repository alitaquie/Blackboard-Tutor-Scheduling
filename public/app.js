
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAPWJQdZePfzjpRlRtMT_gY3HktQvqizAw",
    authDomain: "blackboard-41f8a.firebaseapp.com",
    projectId: "blackboard-41f8a",
    storageBucket: "blackboard-41f8a.appspot.com",
    messagingSenderId: "52140658788",
    appId: "1:52140658788:web:984fc2d26a39c6b8ce0f71",
    measurementId: "G-Q8L0TWFE8J"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    print("sucess")
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    print("fail")
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    print("sucess")
  })
  .catch((error) => {
    print("fail")
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  