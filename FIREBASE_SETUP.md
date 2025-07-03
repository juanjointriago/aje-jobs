# Configuración de Firebase

## Instrucciones para configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "Project Settings" > "General" > "Your apps"
4. Crea una nueva app web o selecciona una existente
5. Copia la configuración de Firebase

## Reemplaza los valores en `src/lib/firebase.ts`

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "tu-api-key-aquí",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
```

## Estructura de la colección 'users' en Firestore

La aplicación espera una colección llamada `users` con documentos que tengan la siguiente estructura:

```javascript
{
  Nombres: "Juan",
  Apellidos: "Pérez",
  Cargo: "Director de Marketing",
  CreatedAt: "2020-01-15",
  Email: "juan.perez@empresa.com",
  Empresa: "Tech Solutions S.A.",
  FechaNac: "15 de Marzo",
  IsActive: "true",
  LinkedInUrl: "https://www.linkedin.com/in/juan-perez",
  NroCelular: "+1 (555) 123-4567",
  PhotoUrl: "https://...",
  TipoSangre: "O+",
  WebSyte: "https://www.techsolutions.com"
}
```

## Ejemplo de URL

Una vez configurado, puedes acceder a las tarjetas usando URLs como:
- `http://localhost:5173/card/usuario123` (donde `usuario123` es el UID del documento en Firestore)
- `http://localhost:5173/card/demo` (para mostrar datos de ejemplo)

## Reglas de seguridad recomendadas para Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura de la colección users (solo lectura)
    match /users/{document} {
      allow read: if true;
      allow write: if false; // Cambiar según tus necesidades
    }
  }
}
```
