// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8ahFiUfy7f2LH8KAXrelKIrXkXse4NyQ",
    authDomain: "mut-directory-admin.firebaseapp.com",
    projectId: "mut-directory-admin",
    storageBucket: "mut-directory-admin.appspot.com",
    messagingSenderId: "526530912413",
    appId: "1:526530912413:web:555780ed7d632177693474",
    measurementId: "G-49F3X4J2C4"
};

// Initialize Firebase
window.firebase = firebase.initializeApp(firebaseConfig);
window.auth = window.firebase.auth();
window.db = window.firebase.firestore();
window.firebaseNamespace = firebase;  // Added to expose firebase SDK namespace

// ImgBB API key
const IMGBB_API_KEY = '98ec981bb43b49caeafb99bf3f82d5e7';
