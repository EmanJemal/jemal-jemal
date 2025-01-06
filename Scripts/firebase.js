// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { 
    getDatabase, ref, set, get, update, remove, onValue, child, push 
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbltFGxtaexx5j8zKZkHa-d0F7XAvAIfM",
    authDomain: "peta-class.firebaseapp.com",
    projectId: "peta-class",
    storageBucket: "peta-class.firebasestorage.app",
    messagingSenderId: "423060223004",
    appId: "1:423060223004:web:349a553dedadc76ac29bd9",
    measurementId: "G-9QJBDP1FLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Export the required Firebase modules
export { 
    getDatabase, database, ref, set, get, update, remove, onValue, child, push, 
    getAuth, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile
};
