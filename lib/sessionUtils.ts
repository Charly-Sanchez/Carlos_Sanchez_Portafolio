/**
 * Utilidades para manejar sesiones de chat con persistencia multi-dispositivo
 */

/**
 * Genera un sessionId único
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un código corto de 6 caracteres (formato: AB-1234)
 */
export function generateShortCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
  const num1 = numbers.charAt(Math.floor(Math.random() * numbers.length));
  const num2 = numbers.charAt(Math.floor(Math.random() * numbers.length));
  const num3 = numbers.charAt(Math.floor(Math.random() * numbers.length));
  const num4 = numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  return `${letter1}${letter2}-${num1}${num2}${num3}${num4}`;
}

/**
 * Valida formato de código corto
 */
export function isValidShortCode(code: string): boolean {
  const regex = /^[A-Z]{2}-[0-9]{4}$/;
  return regex.test(code);
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Genera magic link URL
 */
export function generateMagicLink(sessionId: string, baseUrl: string): string {
  return `${baseUrl}/?session=${sessionId}`;
}

/**
 * Guarda sessionId en localStorage como backup
 */
export function saveSessionToLocal(sessionId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chatSessionId', sessionId);
  }
}

/**
 * Recupera sessionId de localStorage
 */
export function getSessionFromLocal(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('chatSessionId');
  }
  return null;
}

/**
 * Obtiene sessionId desde URL params
 */
export function getSessionFromURL(): string | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('session');
  }
  return null;
}
