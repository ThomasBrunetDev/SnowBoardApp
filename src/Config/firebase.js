// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU1gMXqQ0vTiEKuEEWqBi7kSBbN-7vp4M",
  authDomain: "snowboardapplication.firebaseapp.com",
  projectId: "snowboardapplication",
  storageBucket: "snowboardapplication.appspot.com",
  messagingSenderId: "434393988406",
  appId: "1:434393988406:web:17859569badd84a2c20797"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'users')
getDocs(colRef)
  .then((snapshot) => {
    let users = [];
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });
    console.log(users);
  })
  .catch((err) => {
    console.error(err.message);
  });
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, db, colRef, storage };