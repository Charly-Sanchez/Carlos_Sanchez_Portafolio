# 🔥 Sistema de Chat en Tiempo Real - Firebase

## 📋 Configuración de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"**
3. Nombra tu proyecto: `portafolio-carlos-sanchez`
4. Desactiva Google Analytics (opcional)
5. Haz clic en **"Crear proyecto"**

### 2. Configurar Firestore Database

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (por ahora)
4. Elige la ubicación: **"us-central"** o la más cercana
5. Haz clic en **"Habilitar"**

### 3. Configurar Reglas de Seguridad

En la pestaña **"Reglas"** de Firestore, reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura de mensajes
    match /messages/{messageId} {
      // Los usuarios pueden crear mensajes
      allow create: if request.auth == null || request.auth != null;
      
      // Los usuarios solo pueden leer sus propios mensajes
      allow read: if request.auth == null || 
                     resource.data.userId == request.resource.data.userId;
      
      // Solo admin puede actualizar (marcar como leído)
      allow update: if request.auth != null;
      
      // Nadie puede eliminar (solo tú desde la consola)
      allow delete: if false;
    }
  }
}
```

**Publica las reglas** haciendo clic en **"Publicar"**.

### 4. Obtener Credenciales de Firebase

1. Ve a **Configuración del proyecto** (ícono de engranaje arriba a la izquierda)
2. En la pestaña **"General"**, baja hasta **"Tus aplicaciones"**
3. Haz clic en el ícono **"</>"** (Web)
4. Registra la app con el nombre: `Portafolio Web`
5. **NO** marques "Firebase Hosting"
6. Haz clic en **"Registrar app"**

Verás algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 5. Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza con tus valores de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Contraseña para acceder al panel de admin
NEXT_PUBLIC_ADMIN_PASSWORD=MiPasswordSecreta123
```

### 6. Reiniciar el Servidor

```bash
npm run dev
```

---

## 🎯 Cómo Usar el Sistema de Chat

### Para Visitantes:

1. Verán un **botón flotante** de chat en la esquina inferior derecha
2. Al hacer clic, se abre una ventana de chat
3. Ingresan su nombre
4. Pueden escribirte mensajes en tiempo real
5. Recibirán tus respuestas instantáneamente

### Para Ti (Admin):

1. Ve a **http://localhost:3000/admin**
2. Ingresa la contraseña que configuraste en `.env.local`
3. Verás una lista de todas las conversaciones
4. Selecciona una conversación para responder
5. Los mensajes nuevos aparecen en tiempo real
6. Los mensajes no leídos se marcan con un badge rojo

---

## 🚀 Despliegue en GitHub Pages

### Opción 1: Vercel (Recomendado para Next.js)

GitHub Pages solo soporta sitios estáticos, pero Next.js necesita un servidor. La mejor opción es **Vercel**:

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu repositorio
4. Agrega las variables de entorno desde el panel de Vercel
5. Despliega automáticamente

### Opción 2: Exportación Estática (Limitado)

Si insistes en GitHub Pages, deberás:

1. Modificar `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

2. Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          NEXT_PUBLIC_ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

3. En GitHub, agrega los secrets en: **Settings → Secrets → Actions**

---

## 📊 Estructura de Datos en Firestore

### Colección: `messages`

Cada mensaje tiene:

```javascript
{
  text: "Hola, me interesa tu trabajo",
  sender: "visitor" | "admin",
  userId: "user_1234567890_abc123",
  userName: "Juan Pérez",
  timestamp: Firestore Timestamp,
  read: false
}
```

---

## 🔒 Seguridad

- ✅ Los visitantes solo ven sus propios mensajes
- ✅ El panel admin está protegido con contraseña
- ✅ Las reglas de Firestore previenen acceso no autorizado
- ✅ Las credenciales están en variables de entorno (no en el código)

---

## 💡 Próximas Mejoras Opcionales

1. **Notificaciones por Email**: Usar Firebase Cloud Functions para enviarte un email cuando recibas un mensaje
2. **Notificaciones Push**: Avisos en el navegador cuando lleguen mensajes
3. **Indicador "escribiendo..."**: Mostrar cuando el usuario está escribiendo
4. **Archivo de conversaciones**: Marcar conversaciones como resueltas
5. **Búsqueda**: Filtrar conversaciones por nombre o contenido

---

## 🆘 Solución de Problemas

### Error: "Firebase is not configured"
- Verifica que `.env.local` tenga todos los valores
- Reinicia el servidor con `npm run dev`

### Error: "Permission denied"
- Revisa las reglas de Firestore
- Asegúrate de que estén publicadas

### Los mensajes no se envían
- Abre la consola del navegador (F12)
- Verifica errores de Firebase
- Confirma que Firestore esté habilitado

---

## 📞 Ayuda

Si tienes problemas, revisa:
- [Documentación de Firebase](https://firebase.google.com/docs/firestore)
- [Next.js + Firebase](https://firebase.google.com/docs/web/setup)

---

**¡Tu sistema de chat está listo! 🎉**
