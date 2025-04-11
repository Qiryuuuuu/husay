// app/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPDCWLWeb5oSAhM2Y68WI-BEW-5F1SqYQ",
  authDomain: "husay-polychroma.firebaseapp.com",
  projectId: "husay-polychroma",
  storageBucket: "husay-polychroma.appspot.com",
  messagingSenderId: "964762345333",
  appId: "1:964762345333:android:35e3e3d4d8c577edc2fd3c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };