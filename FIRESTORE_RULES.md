# Reglas de Firestore con Backend Django

## Opción 1: Usando Service Account (RECOMENDADO)

Para permitir escritura desde Django y solo lectura desde React:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Colección users: lectura pública, escritura solo para service accounts
    match /users/{document} {
      allow read: if true; // Lectura pública para el frontend React
      allow write: if request.auth != null && 
        ('firebase-adminsdk' in request.auth.token) || 
        (request.auth.token.admin == true); // Solo service accounts o usuarios admin
    }
    
    // Bloquear acceso a cualquier otra colección
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Opción 2: Usando Custom Claims (ALTERNATIVA)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Colección users: lectura pública, escritura solo para backend
    match /users/{document} {
      allow read: if true; // Lectura pública
      allow write: if request.auth != null && 
        request.auth.token.backend_access == true; // Solo usuarios con claim backend_access
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Explicación de las reglas:

### Opción 1 (Service Account):
1. **`allow read: if true`**: Permite lectura a cualquier usuario
2. **`firebase-adminsdk`**: Identifica solicitudes de Service Account del SDK Admin
3. **`admin == true`**: Custom claim adicional para identificar usuarios admin
4. Solo usuarios autenticados con Service Account pueden escribir

### Opción 2 (Custom Claims):
1. **`allow read: if true`**: Permite lectura a cualquier usuario
2. **`backend_access == true`**: Custom claim que debe ser asignado al usuario del backend
3. Solo usuarios con el claim específico pueden escribir

## Configuración para Django Backend

### Para usar Service Account (Opción 1):

1. **Generar Service Account Key:**
   - Ve a Firebase Console > Project Settings > Service Accounts
   - Haz clic en "Generate new private key"
   - Descarga el archivo JSON

2. **En tu proyecto Django:**

```python
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase Admin SDK
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Usar Firestore
db = firestore.client()

# Ejemplo: crear/actualizar usuario
def create_user(uid, user_data):
    doc_ref = db.collection('users').document(uid)
    doc_ref.set(user_data)
    return True
```

### Para usar Custom Claims (Opción 2):

1. **Crear usuario con claim en Django:**

```python
from firebase_admin import auth

# Crear usuario con custom claim
user = auth.create_user(
    uid='backend_user',
    email='backend@example.com'
)

# Asignar custom claim
auth.set_custom_user_claims('backend_user', {'backend_access': True})
```

2. **Autenticar en Django antes de escribir:**

```python
from firebase_admin import auth

# Obtener token personalizado
custom_token = auth.create_custom_token('backend_user')

# Usar este token para autenticar las solicitudes de escritura
```

## Pasos para aplicar las reglas:

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto "card-unity"
3. Ve a "Firestore Database" en el menú lateral
4. Haz clic en la pestaña "Rules"
5. Reemplaza las reglas existentes con la **Opción 1** (recomendada)
6. Haz clic en "Publish"

## Testing

### Verificar que React no puede escribir:
```javascript
// Este código debería fallar en React
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

try {
  await setDoc(doc(db, 'users', 'test'), { name: 'Test' });
  console.log('ERROR: No debería poder escribir desde React!');
} catch (error) {
  console.log('✅ Correcto: React no puede escribir:', error.message);
}
```

### Verificar que Django puede escribir:
```python
# Este código debería funcionar en Django con Service Account
try:
    doc_ref = db.collection('users').document('test')
    doc_ref.set({'name': 'Test from Django'})
    print('✅ Correcto: Django puede escribir')
except Exception as e:
    print('ERROR: Django no puede escribir:', e)
```

## Reglas anteriores (solo lectura):

Si quieres volver a las reglas anteriores que solo permitían lectura:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
