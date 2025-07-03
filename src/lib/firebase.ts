import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  // Aquí van tus credenciales de Firebase
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Auth
export const auth = getAuth(app);

// Función para autenticar anónimamente
export const signInAnonymouslyIfNeeded = async () => {
  return new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario ya autenticado
        resolve();
      } else {
        // Autenticar anónimamente
        signInAnonymously(auth)
          .then(() => {
            console.log('Signed in anonymously');
            resolve();
          })
          .catch((error) => {
            console.error('Error signing in anonymously:', error);
            resolve(); // Continuar aunque falle la autenticación anónima
          });
      }
    });
  });
};

export default app;
