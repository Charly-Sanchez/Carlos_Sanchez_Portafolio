"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaCopy, FaCheck } from 'react-icons/fa';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import {
  generateSessionId,
  generateShortCode,
  isValidEmail,
  isValidShortCode,
  saveSessionToLocal,
  getSessionFromLocal,
  getSessionFromURL
} from '@/lib/sessionUtils';

interface Message {
  id: string;
  text: string;
  sender: 'visitor' | 'admin';
  timestamp: any;
  sessionId: string;
  read?: boolean;
}

interface ChatSession {
  sessionId: string;
  shortCode: string;
  email?: string;
  userName?: string;
  createdAt: any;
  lastActivity: any;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar o recuperar sesión
  useEffect(() => {
    const initSession = async () => {
      // Intentar recuperar desde URL (magic link)
      const urlSessionId = getSessionFromURL();
      
      if (urlSessionId) {
        // Cargar sesión desde Firestore
        const sessionDoc = await getDoc(doc(db, 'sessions', urlSessionId));
        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data() as ChatSession;
          setSessionId(urlSessionId);
          setShortCode(sessionData.shortCode);
          setUserName(sessionData.userName || '');
          setUserEmail(sessionData.email || '');
          setShowNameInput(false);
          saveSessionToLocal(urlSessionId);
          
          // Limpiar URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }
      }

      // Intentar recuperar desde localStorage
      const localSessionId = getSessionFromLocal();
      if (localSessionId) {
        const sessionDoc = await getDoc(doc(db, 'sessions', localSessionId));
        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data() as ChatSession;
          setSessionId(localSessionId);
          setShortCode(sessionData.shortCode);
          setUserName(sessionData.userName || '');
          setUserEmail(sessionData.email || '');
          setShowNameInput(false);
          return;
        }
      }

      // Nueva sesión
      const newSessionId = generateSessionId();
      const newShortCode = generateShortCode();
      setSessionId(newSessionId);
      setShortCode(newShortCode);
      saveSessionToLocal(newSessionId);
    };

    initSession();
  }, []);

  // Cargar mensajes en tiempo real
  useEffect(() => {
    if (!sessionId || showNameInput) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        loadedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [sessionId, showNameInput]);

  // Auto scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      // Guardar sesión en Firestore
      await setDoc(doc(db, 'sessions', sessionId), {
        sessionId,
        shortCode,
        userName: userName.trim(),
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      });
      
      setShowNameInput(false);
      setShowEmailInput(true); // Solicitar email después del nombre
    }
  };

  const handleSetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim() || !isValidEmail(userEmail)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    try {
      // Actualizar sesión con email
      await updateDoc(doc(db, 'sessions', sessionId), {
        email: userEmail.trim(),
        lastActivity: serverTimestamp()
      });

      // Enviar magic link
      const response = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail.trim(),
          sessionId,
          shortCode
        })
      });

      if (response.ok) {
        setEmailSent(true);
        setShowEmailInput(false);
      } else {
        console.error('Error al enviar magic link');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipEmail = () => {
    setShowEmailInput(false);
  };

  const handleRecoverSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInputValue.trim() || !isValidShortCode(codeInputValue.toUpperCase())) {
      alert('Código inválido. Formato: AB-1234');
      return;
    }

    setIsLoading(true);
    try {
      // Buscar sesión por shortCode
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, where('shortCode', '==', codeInputValue.toUpperCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const sessionDoc = snapshot.docs[0];
        const sessionData = sessionDoc.data() as ChatSession;
        
        setSessionId(sessionData.sessionId);
        setShortCode(sessionData.shortCode);
        setUserName(sessionData.userName || '');
        setUserEmail(sessionData.email || '');
        setShowCodeInput(false);
        setShowNameInput(false);
        saveSessionToLocal(sessionData.sessionId);
      } else {
        alert('Código no encontrado');
      }
    } catch (error) {
      console.error('Error al recuperar sesión:', error);
      alert('Error al recuperar la sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const copyShortCode = () => {
    navigator.clipboard.writeText(shortCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        sender: 'visitor',
        sessionId: sessionId,
        userName: userName,
        timestamp: serverTimestamp(),
        read: false
      });
      
      // Actualizar última actividad
      await updateDoc(doc(db, 'sessions', sessionId), {
        lastActivity: serverTimestamp()
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar mensaje. Verifica tu configuración de Firebase.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <FaTimes className="text-white text-2xl" />
        ) : (
          <FaComments className="text-white text-2xl" />
        )}
        
        {/* Indicador de mensajes sin leer */}
        {messages.some(m => m.sender === 'admin' && !m.read) && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Ventana de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-gray-900 border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="font-bold text-lg">Chat con Carlos</h3>
              <p className="text-sm text-blue-100">
                {showNameInput ? 'Ingresa tu nombre para comenzar' : 
                 showEmailInput ? 'Guarda tu conversación' :
                 showCodeInput ? 'Recupera tu sesión' :
                 'Responderé lo antes posible'}
              </p>
              {!showNameInput && !showEmailInput && !showCodeInput && shortCode && (
                <div className="mt-2 text-xs bg-white/10 rounded px-2 py-1 flex items-center justify-between">
                  <span>Código: <strong>{shortCode}</strong></span>
                  <button onClick={copyShortCode} className="ml-2 hover:scale-110 transition-transform">
                    {copiedCode ? <FaCheck size={12} /> : <FaCopy size={12} />}
                  </button>
                </div>
              )}
            </div>

            {/* Formulario de nombre */}
            {showNameInput ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full space-y-4">
                  <form onSubmit={handleSetName} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ¿Cómo te llamas?
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Continuar
                    </button>
                  </form>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowCodeInput(true)}
                      className="text-blue-400 text-sm hover:underline"
                    >
                      ¿Ya tienes un código? Recuperar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : showEmailInput ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full space-y-4">
                  {!emailSent ? (
                    <form onSubmit={handleSetEmail} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          📧 Para continuar desde otro dispositivo
                        </label>
                        <p className="text-xs text-gray-400 mb-3">
                          Te enviaremos un enlace mágico y tu código de sesión
                        </p>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="tu@email.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSkipEmail}
                        className="w-full text-gray-400 text-sm hover:text-white transition-colors"
                      >
                        Omitir por ahora
                      </button>
                    </form>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-green-400 text-4xl">✓</div>
                      <p className="text-white">¡Enlace enviado a tu email!</p>
                      <p className="text-sm text-gray-400">
                        También puedes usar tu código: <strong className="text-white">{shortCode}</strong>
                      </p>
                      <button
                        onClick={() => setShowEmailInput(false)}
                        className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                      >
                        Comenzar a chatear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : showCodeInput ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full space-y-4">
                  <form onSubmit={handleRecoverSession} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ingresa tu código de sesión
                      </label>
                      <input
                        type="text"
                        value={codeInputValue}
                        onChange={(e) => setCodeInputValue(e.target.value.toUpperCase())}
                        placeholder="AB-1234"
                        maxLength={7}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 text-center text-lg font-mono"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Recuperando...' : 'Recuperar Sesión'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCodeInput(false);
                        setShowNameInput(true);
                      }}
                      className="w-full text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      ← Volver
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                      <p>¡Hola {userName}! 👋</p>
                      <p className="text-sm mt-2">Escríbeme cualquier pregunta</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2 rounded-lg ${
                            message.sender === 'visitor'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-100'
                          }`}
                        >
                          <p className="text-sm break-words">{message.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de mensaje */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !newMessage.trim()}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPaperPlane className="text-white" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
