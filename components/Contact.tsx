"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío - aquí integrarías con un servicio como EmailJS, SendGrid, etc.
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'cs33074188@gmail.com',
      href: 'mailto:cs33074188@gmail.com'
    },
    {
      icon: FaPhone,
      label: 'Teléfono',
      value: '+34 614 83 54 28',
      href: 'tel:+34614835428'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Ubicación',
      value: 'España',
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      label: 'GitHub',
      href: 'https://github.com/Charly-Sanchez',
      color: 'hover:text-gray-400'
    },
    {
      icon: FaLinkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/carlos-sánchez-ba5422394',
      color: 'hover:text-blue-400'
    }
  ];

  return (
    <section id="contacto" className="min-h-screen py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Contacto
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            ¿Tienes un proyecto en mente? Hablemos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulario de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-500"
                  placeholder="¿En qué puedo ayudarte?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-500 resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center"
                >
                  ¡Mensaje enviado con éxito! Te responderé pronto.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center"
                >
                  Hubo un error al enviar el mensaje. Intenta nuevamente.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Información de Contacto y Redes Sociales */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-blue-400 text-2xl">
                    <item.icon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Redes Sociales */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Sígueme</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    className={`p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all ${social.color}`}
                  >
                    <social.icon className="text-3xl" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mensaje de Disponibilidad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg border border-blue-500/20"
            >
              <h4 className="text-xl font-bold text-white mb-2">Disponible para Proyectos</h4>
              <p className="text-gray-300">
                Actualmente estoy disponible para proyectos freelance y oportunidades de colaboración. 
                Si tienes una idea o proyecto en mente, no dudes en contactarme.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
