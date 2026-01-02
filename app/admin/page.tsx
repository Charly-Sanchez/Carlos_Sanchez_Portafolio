"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaClock, FaCheckDouble, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  where,
  getDocs
} from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  sender: 'visitor' | 'admin';
  timestamp: any;
  userId: string;
  userName: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastTimestamp: any;
  unreadCount: number;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cargar conversaciones
  useEffect(() => {
    if (!isAuthenticated) return;

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const conversationsMap = new Map<string, Conversation>();

      snapshot.forEach((doc) => {
        const message = doc.data() as Message;
        if (!conversationsMap.has(message.userId)) {
          conversationsMap.set(message.userId, {
            userId: message.userId,
            userName: message.userName || 'Usuario Anónimo',
            lastMessage: message.text,
            lastTimestamp: message.timestamp,
            unreadCount: 0
          });
        }
      });

      // Contar mensajes no leídos
      for (const [userId, conv] of conversationsMap.entries()) {
        const unreadQuery = query(
          messagesRef,
          where('userId', '==', userId),
          where('sender', '==', 'visitor'),
          where('read', '==', false)
        );
        const unreadSnapshot = await getDocs(unreadQuery);
        conv.unreadCount = unreadSnapshot.size;
      }

      setConversations(Array.from(conversationsMap.values()));
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Cargar mensajes de conversación seleccionada
  useEffect(() => {
    if (!isAuthenticated || !selectedUserId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('userId', '==', selectedUserId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        loadedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(loadedMessages);

      // Marcar mensajes como leídos
      snapshot.forEach(async (docSnapshot) => {
        const message = docSnapshot.data() as Message;
        if (message.sender === 'visitor' && !message.read) {
          await updateDoc(doc(db, 'messages', docSnapshot.id), { read: true });
        }
      });
    });

    return () => unsubscribe();
  }, [isAuthenticated, selectedUserId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || isLoading) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        sender: 'admin',
        userId: selectedUserId,
        userName: 'Carlos Sánchez',
        timestamp: serverTimestamp(),
        read: true
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-gray-900 border border-white/10 rounded-lg"
        >
          <div className="text-center mb-8">
            <FaLock className="text-4xl text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Ingresa tu contraseña para acceder</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Iniciar Sesión
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Panel de Mensajes
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto h-[calc(100vh-80px)] flex">
        {/* Lista de conversaciones */}
        <div className="w-1/3 border-r border-white/10 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Conversaciones ({conversations.length})</h2>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedUserId(conv.userId)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedUserId === conv.userId
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-400" />
                      <span className="font-semibold">{conv.userName}</span>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-xs rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate mb-1">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaClock />
                    <span>{formatTimestamp(conv.lastTimestamp)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              {/* Header del chat */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  <span className="font-semibold">
                    {conversations.find(c => c.userId === selectedUserId)?.userName}
                  </span>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                          : 'bg-white/10'
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-gray-300">
                        <span>{formatTimestamp(message.timestamp)}</span>
                        {message.sender === 'admin' && <FaCheckDouble />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FaEnvelope className="text-6xl mx-auto mb-4 opacity-20" />
                <p>Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
