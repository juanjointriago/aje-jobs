# 👻 Usuarios Anónimos en Firebase - Persistencia y Expiración

## 🔍 ¿Cuándo se eliminan o pierden sesión los usuarios anónimos?

### 📱 **Comportamiento en diferentes plataformas:**

#### **Navegadores Web (React)**:
- **Persistencia**: Los usuarios anónimos persisten **hasta que el usuario borre los datos del navegador**
- **Almacenamiento**: Se guardan en `localStorage` del navegador
- **Duración**: **Indefinida** mientras no se borren los datos

#### **Aplicaciones Móviles (iOS/Android)**:
- **Persistencia**: Persisten hasta que se **desinstale la aplicación**
- **Almacenamiento**: Se guardan en el almacenamiento local de la app
- **Duración**: **Indefinida** mientras la app esté instalada

### 🕒 **Escenarios específicos de pérdida de sesión:**

#### **✅ La sesión anónima SE MANTIENE cuando:**
- Se cierra y abre el navegador
- Se reinicia el dispositivo
- Se pierde conexión a internet temporalmente
- Se navega entre páginas de la aplicación
- Se pasa tiempo sin usar la aplicación

#### **❌ La sesión anónima SE PIERDE cuando:**
- **Navegador**: Usuario borra datos/cookies del navegador
- **Navegador**: Usuario usa modo incógnito/privado (se pierde al cerrar)
- **Navegador**: Se borra `localStorage` manualmente
- **Móvil**: Se desinstala la aplicación
- **Móvil**: Se borran los datos de la aplicación
- **Código**: Se llama a `auth.signOut()` explícitamente
- **Firebase**: Se elimina el usuario desde Firebase Console (raro)

### 📊 **Duración típica en la práctica:**

| Plataforma | Duración Promedio | Motivo de Pérdida |
|------------|-------------------|-------------------|
| **Desktop** | **Semanas/Meses** | Usuario borra datos manualmente |
| **Móvil** | **Meses/Años** | Desinstalación de app |
| **Incógnito** | **Sesión actual** | Se pierde al cerrar navegador |

## 🔧 **Configuración actual en el proyecto:**

### **Estado de persistencia:**
```typescript
// En src/lib/firebase.ts
export const signInAnonymouslyIfNeeded = async () => {
  return new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario ya autenticado (PERSISTE)
        resolve();
      } else {
        // Autenticar anónimamente (NUEVO USUARIO)
        signInAnonymously(auth)
          .then(() => {
            console.log('Signed in anonymously');
            resolve();
          })
          .catch((error) => {
            console.error('Error signing in anonymously:', error);
            resolve();
          });
      }
    });
  });
};
```

### **¿Qué significa esto para tu aplicación?**

1. **Primera visita**: Se crea usuario anónimo
2. **Visitas posteriores**: Se reutiliza el mismo usuario anónimo
3. **Lectura de datos**: Funciona correctamente con el usuario persistente
4. **Sin problemas de límites**: No se crean usuarios anónimos innecesarios

## 🛡️ **Implicaciones de seguridad:**

### **Ventajas:**
- ✅ Los usuarios pueden acceder a los datos sin registrarse
- ✅ La experiencia es fluida entre sesiones
- ✅ No se crean usuarios duplicados constantemente

### **Consideraciones:**
- ⚠️ Los usuarios anónimos no pueden recuperar acceso si pierden los datos
- ⚠️ No hay forma de "recuperar cuenta" para usuarios anónimos
- ⚠️ En modo incógnito siempre se crea un nuevo usuario anónimo

## 📈 **Métricas y limites de Firebase:**

### **Cuota de usuarios anónimos:**
- **Spark (Gratis)**: 10,000 usuarios autenticados simultáneos
- **Blaze (Pago)**: Sin límite, pero se cobra por usuario activo mensual

### **¿Qué cuenta como "usuario activo"?**
- Usuario que se autentica en los últimos 30 días
- Los usuarios anónimos "durmientes" no cuentan hacia la cuota

## 🔧 **Configuraciones opcionales:**

### **1. Forzar nueva sesión anónima:**
```typescript
// Si quieres forzar una nueva sesión (no recomendado)
export const forceNewAnonymousUser = async () => {
  await auth.signOut(); // Cerrar sesión actual
  await signInAnonymously(auth); // Crear nueva sesión
};
```

### **2. Verificar estado de persistencia:**
```typescript
// Verificar si el usuario actual es anónimo
export const isAnonymousUser = () => {
  return auth.currentUser?.isAnonymous || false;
};

// Obtener ID del usuario anónimo actual
export const getCurrentAnonymousUID = () => {
  return auth.currentUser?.uid || null;
};
```

### **3. Manejar pérdida de sesión:**
```typescript
// En tu hook useUser
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Usuario perdió sesión - reautenticar
      signInAnonymouslyIfNeeded();
    }
  });
  
  return unsubscribe;
}, []);
```

## 🎯 **Recomendaciones para tu aplicación:**

### **✅ Mantener configuración actual:**
- La configuración actual es óptima para tu caso de uso
- Los usuarios mantienen acceso entre sesiones
- No hay creación innecesaria de usuarios anónimos

### **✅ Considerar para el futuro:**
- **Monitorear métricas** de usuarios activos en Firebase Console
- **Implementar analytics** para entender patrones de uso
- **Considerar migración** a usuarios registrados si es necesario

### **✅ Documentar para usuarios:**
- Informar que el acceso se mantiene en el mismo dispositivo/navegador
- Explicar que borrar datos del navegador requiere nueva visita
- Considerar mensaje sobre modo incógnito si es relevante

## 🚨 **Casos especiales:**

### **Modo incógnito/privado:**
```typescript
// Detectar modo incógnito (opcional)
const isIncognitoMode = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return false;
  } catch {
    return true; // Probablemente modo incógnito
  }
};
```

### **Múltiples pestañas:**
- Los usuarios anónimos se comparten entre pestañas del mismo navegador
- No hay conflictos entre pestañas

## 📝 **Resumen:**

Los usuarios anónimos en tu aplicación **persisten indefinidamente** hasta que:
- Se borren los datos del navegador (manual)
- Se desinstale la aplicación (móvil)
- Se use modo incógnito (temporal)

Para tu caso de uso (tarjetas digitales de solo lectura), esta configuración es **perfecta** y **eficiente**.
