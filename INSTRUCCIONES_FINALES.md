# ✅ INSTRUCCIONES FINALES - Actualizar Reglas de Firebase

## 🎯 Objetivo
Permitir que tu backend Django siga escribiendo usuarios en Firestore, pero restringir la escritura desde el frontend React (solo lectura).

## 📋 Pasos a seguir

### 1. Aplicar las nuevas reglas de Firestore

1. **Ve a Firebase Console**: https://console.firebase.google.com/
2. **Selecciona tu proyecto**: "card-unity"
3. **Ve a "Firestore Database"** en el menú lateral
4. **Haz clic en la pestaña "Rules"**
5. **Reemplaza las reglas existentes** con estas reglas (**Opción 1 - RECOMENDADA**):

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

6. **Haz clic en "Publish"**

### 2. Configurar Service Account para Django

1. **Generar Service Account Key**:
   - Ve a Firebase Console > Project Settings > Service Accounts
   - Haz clic en "Generate new private key"
   - Descarga el archivo JSON (guárdalo de forma segura)

2. **Configurar en Django**:
   - Instala: `pip install firebase-admin`
   - Sigue las instrucciones en `DJANGO_BACKEND_SETUP.md`

### 3. Verificar que funciona

#### ✅ Frontend React (debe fallar al escribir):
1. **Abrir la aplicación**: http://localhost:5173/
2. **En modo desarrollo**: Verás un botón 🧪 en la esquina superior derecha
3. **Hacer clic en el botón de prueba**: Debería mostrar en consola que React NO puede escribir
4. **Abrir DevTools (F12)** y verificar los mensajes de consola

#### ✅ Backend Django (debe poder escribir):
- Usar el Firebase Admin SDK con Service Account
- Ejemplo de código en `DJANGO_BACKEND_SETUP.md`

## 🧪 Resultados esperados

### Frontend React:
```
🧪 Probando reglas de Firestore...
📝 Test 1: Intentando escribir con setDoc...
✅ Correcto: React no puede escribir con setDoc
   Error: Missing or insufficient permissions.
📝 Test 2: Intentando escribir con addDoc...
✅ Correcto: React no puede escribir con addDoc
   Error: Missing or insufficient permissions.
📝 Test 3: Intentando escribir en otra colección...
✅ Correcto: React no puede escribir en otras colecciones
   Error: Missing or insufficient permissions.
🎉 Todas las pruebas pasaron! Las reglas de Firestore están correctamente configuradas.
```

### Backend Django:
```python
# Este código debería funcionar
doc_ref = db.collection('users').document('test')
doc_ref.set({'name': 'Test from Django'})
print('✅ Django puede escribir correctamente')
```

## 📚 Archivos de referencia

- `FIRESTORE_RULES.md` - Reglas completas y explicación
- `DJANGO_BACKEND_SETUP.md` - Configuración completa del backend
- `FIREBASE_SETUP.md` - Configuración inicial de Firebase
- `FIREBASE_ANONYMOUS_USERS.md` - Comportamiento y persistencia de usuarios anónimos
- `src/utils/testFirestoreRules.ts` - Script de pruebas para React

## 👻 Información sobre usuarios anónimos

**¿Cuándo se eliminan los usuarios anónimos?**
- **Navegador**: Solo cuando el usuario borra datos/cookies manualmente
- **Móvil**: Solo cuando se desinstala la aplicación
- **Duración típica**: Semanas/meses en desktop, meses/años en móvil
- **Persistencia**: Se mantienen entre sesiones, reinicios, y pérdidas de conexión

Ver `FIREBASE_ANONYMOUS_USERS.md` para información detallada sobre persistencia y comportamiento.

## ⚠️ Importante

1. **NO commitees** el archivo JSON del Service Account a git
2. **Usa variables de entorno** para las credenciales en producción
3. **Mantén actualizadas** las reglas según tus necesidades de seguridad
4. **Prueba siempre** después de cambiar reglas

## 🎉 ¡Listo!

Una vez aplicadas estas reglas:
- ✅ Tu frontend React podrá leer datos de usuarios
- ✅ Tu backend Django podrá crear/actualizar/eliminar usuarios
- ❌ Tu frontend React NO podrá escribir datos (más seguro)
- ❌ Nadie podrá acceder a otras colecciones

La configuración está lista para producción con seguridad adecuada.
