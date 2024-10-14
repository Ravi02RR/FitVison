
import { initializeApp } from "firebase/app";
import { env } from "../config/confo.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId
};
// console.log(env)
// console.log(firebaseConfig)
// Initialize Firebase
export const FireBaseapp = initializeApp(firebaseConfig);