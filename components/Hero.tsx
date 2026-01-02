'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Typewriter from './Typewriter';

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-6 pt-20 md:pt-0"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0"
          >
            {/* Gradient Background Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-xl animate-pulse"></div>
            
            {/* Image Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {/* Placeholder - Replace with your photo */}
              <div className="text-white/30 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-32 h-32 mx-auto mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-xs">Tu Foto Aquí</p>
              </div>
              {/* Uncomment when you add your photo:
              <Image
                src="/your-photo.jpg"
                alt="Carlos Sánchez"
                fill
                className="object-cover"
                priority
              />
              */}
            </div>
          </motion.div>

          {/* Text Section */}
          <div className="flex-1 text-center md:text-left">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-4"
            >
              <span className="text-blue-400 text-base md:text-lg font-medium tracking-wider">
                Hola, soy
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight"
            >
              Carlos Sánchez
            </motion.h1>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mb-6 md:mb-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Programador Senior Full Stack
              </h2>
            </motion.div>

            {/* Description - Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="text-white/70 text-base md:text-lg max-w-2xl mx-auto md:mx-0 mb-8 md:mb-12 leading-relaxed"
            >
              <Typewriter
                text="Con más de 8 años de experiencia desarrollando soluciones innovadoras con múltiples frameworks y tecnologías modernas."
                delay={50}
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="flex gap-4 md:gap-6 justify-center md:justify-start flex-wrap"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-2xl transition-shadow duration-300 text-sm md:text-base"
              >
                Ver Proyectos
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 md:px-8 py-3 md:py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-colors duration-300 text-sm md:text-base"
              >
                Contactar
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full"></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
