import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getDatabase, ref} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBeTyHVR2cEGFZOWaToiNPjpDw9cEriiuM",
  authDomain: "doaniot-c6a10.firebaseapp.com",
  databaseURL: "https://doaniot-c6a10-default-rtdb.firebaseio.com",
  projectId: "doaniot-c6a10",
  storageBucket: "doaniot-c6a10.appspot.com",
  messagingSenderId: "943597730394",
  appId: "1:943597730394:web:10eb285a1359b4aad9b663",
  measurementId: "G-HZ02DBNTVN",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);
const analytics = getAnalytics(app);

export {dbRef};
