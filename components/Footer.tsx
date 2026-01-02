"use client";

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Sobre Mí', href: '#sobre-mi' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Contacto', href: '#contacto' }
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      href: 'https://github.com/Charly-Sanchez',
      label: 'GitHub'
    },
    {
      icon: FaLinkedin,
      href: 'https://www.linkedin.com/in/carlos-sánchez-ba5422394',
      label: 'LinkedIn'
    }
  ];

  return (
    <footer className="relative py-12 px-4 border-t border-white/10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Columna 1: Nombre y Descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Carlos Sánchez
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              Desarrollador Full Stack apasionado por crear soluciones web innovadoras y escalables.
            </p>
          </motion.div>

          {/* Columna 2: Enlaces de Navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 3: Redes Sociales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Conéctate</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all"
                >
                  <social.icon className="text-xl text-gray-400 hover:text-blue-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Separador */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Copyright y Créditos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            Hecho con <FaHeart className="text-red-500 animate-pulse" /> por Carlos Sánchez
          </p>
          <p className="text-gray-500 text-xs">
            © {currentYear} Carlos Sánchez. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>

      {/* Decoración de fondo */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </footer>
  );
}
