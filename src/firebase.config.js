import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFLDfevbg5Nq8nzfLf1z8wZx_QuWJJyp8",
  authDomain: "full-stack-react-note.firebaseapp.com",
  projectId: "full-stack-react-note",
  storageBucket: "full-stack-react-note.appspot.com",
  messagingSenderId: "76917532738",
  appId: "1:76917532738:web:a336d9452dc649463565db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);