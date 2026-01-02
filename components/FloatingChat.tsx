"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where 
} from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  sender: 'visitor' | 'admin';
  timestamp: any;
  userId: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generar o recuperar ID único del usuario
  useEffect(() => {
    let storedUserId = localStorage.getItem('chatUserId');
    let storedUserName = localStorage.getItem('chatUserName');

    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatUserId', storedUserId);
    }

    if (storedUserName) {
      setShowNameInput(false);
      setUserName(storedUserName);
    }

    setUserId(storedUserId);
  }, []);

  // Cargar mensajes en tiempo real
  useEffect(() => {
    if (!userId || showNameInput) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('userId', '==', userId),
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
  }, [userId, showNameInput]);

  // Auto scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('chatUserName', userName.trim());
      setShowNameInput(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        sender: 'visitor',
        userId: userId,
        userName: userName,
        timestamp: serverTimestamp(),
        read: false
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
                {showNameInput ? 'Ingresa tu nombre para comenzar' : 'Responderé lo antes posible'}
              </p>
            </div>

            {/* Formulario de nombre */}
            {showNameInput ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <form onSubmit={handleSetName} className="w-full space-y-4">
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
                    Comenzar Chat
                  </button>
                </form>
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
