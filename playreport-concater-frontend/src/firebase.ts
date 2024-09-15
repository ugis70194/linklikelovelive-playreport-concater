// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFs9kmxTYZqwdbO5j3kdDpKaHWkt31q5I",
  authDomain: "shool-idol-stage-supporter.firebaseapp.com",
  projectId: "shool-idol-stage-supporter",
  storageBucket: "shool-idol-stage-supporter.appspot.com",
  messagingSenderId: "857461860801",
  appId: "1:857461860801:web:6dbcd7b10bbe0502652740",
  measurementId: "G-H9P9TGDDWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics }