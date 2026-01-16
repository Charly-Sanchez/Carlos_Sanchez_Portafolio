# Sistema de Sesiones Multi-Dispositivo para Chat

## 🎯 Características

- **Sin registro complicado**: Solo nombre para comenzar
- **Sesiones persistentes**: Continúa desde cualquier dispositivo
- **Magic Link por email**: Recibe un enlace para recuperar tu conversación
- **Código corto**: Formato AB-1234 fácil de recordar
- **Multi-dispositivo**: Misma conversación en móvil, tablet y desktop

## 🚀 Cómo Funciona

### Para Visitantes

1. **Primera vez**:
   - Ingresa tu nombre
   - (Opcional) Ingresa tu email para recibir magic link
   - Recibes un código de sesión (ej: AB-1234)

2. **Desde otro dispositivo**:
   - **Opción 1**: Haz clic en el magic link del email
   - **Opción 2**: Ingresa tu código de sesión en el chat

### Estructura de Datos en Firebase

#### Colección `sessions`:
```typescript
{
  sessionId: string       // ID único de sesión
  shortCode: string       // Código corto (AB-1234)
  userName: string        // Nombre del usuario
  email?: string          // Email opcional
  createdAt: timestamp    // Fecha de creación
  lastActivity: timestamp // Última actividad
}
```

#### Colección `messages`:
```typescript
{
  text: string           // Contenido del mensaje
  sender: 'visitor' | 'admin'
  sessionId: string      // Referencia a la sesión
  userName: string       // Nombre del remitente
  timestamp: timestamp   // Fecha del mensaje
  read: boolean         // Estado de lectura
}
```

## 📧 Configurar Envío de Emails

El sistema usa `/api/send-magic-link` para enviar emails. Actualmente solo registra en consola.

### Integrar con Resend (Recomendado):

1. Instalar Resend:
```bash
npm install resend
```

2. Agregar variable de entorno en `.env.local`:
```
RESEND_API_KEY=tu_api_key
NEXT_PUBLIC_BASE_URL=https://tudominio.com
```

3. Actualizar `app/api/send-magic-link/route.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Carlos Sánchez <noreply@tudominio.com>',
  to: email,
  subject: 'Tu enlace para continuar la conversación',
  html: `
    <h2>Continúa tu conversación</h2>
    <p>Haz clic aquí para continuar: <a href="${magicLink}">${magicLink}</a></p>
    <p>O usa este código: <strong>${shortCode}</strong></p>
  `
});
```

### Alternativas:
- **SendGrid**: Muy confiable, plan gratuito generoso
- **Mailgun**: Bueno para volumen alto
- **Amazon SES**: Muy económico

## 🔒 Seguridad

- ✅ Códigos únicos de 6 caracteres
- ✅ SessionIds con timestamp y aleatorios
- ✅ Magic links con tokens únicos
- ✅ Sin almacenamiento de contraseñas
- ⚠️ Considera agregar expiración de sesiones (30 días recomendado)

## 📱 UX Flow

```
Nuevo Usuario
    ↓
Ingresa nombre → Genera sessionId + shortCode
    ↓
(Opcional) Ingresa email → Envía magic link
    ↓
Chatea normalmente
    ↓
Cambia de dispositivo
    ↓
Opción A: Click en magic link → Auto-login
Opción B: Ingresa código AB-1234 → Recupera sesión
```

## 🎨 Personalización

### Modificar formato del código:
Edita `lib/sessionUtils.ts` → `generateShortCode()`

### Cambiar duración de sesiones:
Agrega lógica de expiración en las queries de Firestore

### Customizar emails:
Edita `app/api/send-magic-link/route.ts`

## 🐛 Troubleshooting

**El código no funciona:**
- Verifica reglas de Firestore (debe permitir lectura/escritura)
- Revisa consola del navegador para errores

**Magic link no llega:**
- Verifica configuración de API key
- Revisa spam/correo no deseado
- Verifica logs de la API route

**Sesión no persiste:**
- Verifica que Firebase esté correctamente configurado
- Revisa que los índices compuestos estén creados en Firestore
