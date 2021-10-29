import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWG8VLg67MqZ5gcjcWtRxNUkFH5C-CX2k",
  authDomain: "z-social-bf99d.firebaseapp.com",
  projectId: "z-social-bf99d",
  storageBucket: "z-social-bf99d.appspot.com",
  messagingSenderId: "74331206869",
  appId: "1:74331206869:web:138ea213a1b99e78bfde5c",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
