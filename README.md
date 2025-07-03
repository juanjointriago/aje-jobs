# Tarjeta Digital Profesional

Una aplicación moderna de tarjetas digitales tipo "business card" construida con React, TypeScript, Tailwind CSS y Firebase.

## ✨ Características

- 🎴 **Diseño de Tarjeta con Flip 3D**: Tarjeta interactiva con animación de volteo
- 📱 **Completamente Responsivo**: Optimizado para móvil y desktop
- 🌓 **Modo Claro/Oscuro**: Alternancia entre temas
- 🔗 **Navegación por Tabs**: Contact, Company, y Socials
- 🔥 **Integración con Firebase**: Datos dinámicos desde Firestore
- 🎯 **URLs Personalizadas**: Cada usuario tiene su propia URL única
- ⚡ **Iconos con React Icons**: Iconografía moderna y consistente
- 🛡️ **Manejo de Errores**: Páginas elegantes para usuarios no encontrados
- 📐 **Safe Area Support**: Padding seguro para dispositivos con notch

## 🚀 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Firebase/Firestore** para base de datos
- **React Router** para navegación
- **React Icons** para iconografía
- **Vite** como bundler

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repo>
cd aje_jobs
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura Firebase siguiendo las instrucciones en `FIREBASE_SETUP.md`

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🔧 Configuración de Firebase

Ver el archivo `FIREBASE_SETUP.md` para instrucciones detalladas sobre cómo configurar Firebase y la estructura de datos esperada.

## 🛡️ Seguridad y Backend

- **Reglas de Firestore**: Solo lectura desde el frontend, escritura solo desde backend Django
- **Backend Django**: Ver `DJANGO_BACKEND_SETUP.md` para configuración completa
- **Service Account**: Autenticación segura para el backend
- **Reglas Actualizadas**: Ver `FIRESTORE_RULES.md` para las reglas de seguridad

### Pruebas de Seguridad

En modo desarrollo, aparece un botón 🧪 en la tarjeta que permite probar las reglas de Firestore. Verifica que:
- React no puede escribir datos (✅ correcto)
- React puede leer datos (✅ correcto)
- Solo el backend Django puede escribir datos

## 📖 Estructura del Proyecto

```
src/
├── components/
│   ├── card/
│   │   └── VCard.tsx          # Componente principal de la tarjeta
│   └── NotFound.tsx           # Página de error 404
├── hooks/
│   └── useUser.ts             # Hook para obtener datos de usuario
├── lib/
│   └── firebase.ts            # Configuración de Firebase
├── pages/                     # Páginas adicionales (vacío por ahora)
├── App.tsx                    # Configuración de rutas
├── main.tsx                   # Punto de entrada
└── index.css                  # Estilos globales
```

## 🌐 Rutas

- `/` - Redirige a `/card/demo`
- `/card/:uid` - Muestra la tarjeta del usuario con el UID especificado
- `*` - Cualquier ruta no encontrada redirige a `/card/demo`

## 📱 Funcionalidades de la Tarjeta

### Lado Frontal
- Información básica del usuario (nombre, cargo, empresa)
- Botón de flip para voltear la tarjeta
- Toggle de modo claro/oscuro

### Lado Trasero
- **Tab Contact**: Email, teléfono, cumpleaños
- **Tab Company**: Información de la empresa, dirección, miembro desde
- **Tab Socials**: LinkedIn y sitio web
- Botones de acción (agregar contacto, LinkedIn)

## 🎨 Características de Diseño

- **Responsive**: Se adapta perfectamente a móvil y desktop
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Smooth Animations**: Transiciones fluidas en todas las interacciones
- **Modern UI**: Diseño limpio y profesional
- **Safe Areas**: Respeta las áreas seguras de dispositivos móviles

## 📊 Estructura de Datos en Firestore

Colección: `users`

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

## 🔍 Estados de la Aplicación

- **Loading**: Skeleton de carga mientras se obtienen los datos
- **Success**: Muestra la tarjeta con los datos del usuario
- **Error**: Página NotFound para usuarios no encontrados
- **Fallback**: Muestra "-------" en campos vacíos

## 🚀 Deployment

Para producción, asegúrate de:

1. **Frontend React**:
   - Configurar las variables de entorno de Firebase
   - Optimizar las imágenes y assets
   - Configurar el routing del servidor para SPA
   - Aplicar las reglas de Firestore que solo permiten lectura

2. **Backend Django**:
   - Configurar Firebase Admin SDK con Service Account
   - Implementar endpoints para CRUD de usuarios
   - Sincronización automática con Firestore
   - Variables de entorno seguras para credenciales

3. **Firestore**:
   - Aplicar reglas de seguridad (ver `FIRESTORE_RULES.md`)
   - Solo lectura para frontend React
   - Solo escritura para backend Django con Service Account

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

Desarrollado con ❤️ para crear tarjetas digitales profesionales modernas.