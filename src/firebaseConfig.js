import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyBomr8NtsqAk-MUQIutAMra33Y_zd5U_8Y",
    authDomain: "hidden-paradis.firebaseapp.com",
    projectId: "hidden-paradis",
    storageBucket: "hidden-paradis.appspot.com",
    messagingSenderId: "770394507297",
    appId: "1:770394507297:web:ab32003a406caacf017b60"
});
 
// Firebase storage reference
const storage = getStorage(app);
export default storage;
