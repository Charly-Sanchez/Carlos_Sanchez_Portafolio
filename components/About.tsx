'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showAllSkills, setShowAllSkills] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const skills = [
    'Python',
    'JavaScript',
    'HTML5 & CSS3',
    'PHP',
    'SQL',
    'C++',
    'Git & GitHub',
    'Bootstrap',
    'POO',
    'Bases de Datos',
  ];

  const frameworks = [
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Tailwind CSS',
    'Vue.js',
    'Laravel',
    'jQuery',
  ];

  const services = [
    {
      icon: '💻',
      title: 'Desarrollo Web Full Stack',
      description: 'Aplicaciones web modernas con arquitectura escalable y diseño responsivo.',
    },
    {
      icon: '📊',
      title: 'Gestión de Proyectos',
      description: 'Liderazgo técnico y coordinación de equipos de desarrollo.',
    },
    {
      icon: '👨‍🏫',
      title: 'Docencia en Programación',
      description: 'Formación de desarrolladores en programación y matemáticas.',
    },
    {
      icon: '🎨',
      title: 'Diseño Web & Gráfico',
      description: 'Interfaces modernas y material gráfico profesional.',
    },
  ];

  const softSkills = [
    { icon: '🚀', text: 'Proactivo' },
    { icon: '🤝', text: 'Trabajo en Equipo' },
    { icon: '📚', text: 'Aprendizaje Continuo' },
    { icon: '💡', text: 'Pensamiento Lógico' },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 md:py-32"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-6xl mx-auto w-full"
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Sobre{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Mí
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Main Bio Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-3xl">👋</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Carlos Sánchez
                </h3>
                <p className="text-lg text-white/80">
                  Desarrollador Web Senior | Docente | Estudiante de Ingeniería en Sistemas
                </p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed text-base mb-6">
              Desarrollador apasionado desde 2017, especializado en crear soluciones web elegantes 
              y escalables. Actualmente trabajo como freelance y comparto mi conocimiento como 
              catedrático en el Colegio Galileo Galilei, enseñando programación y matemáticas. 
              Mi enfoque está en el aprendizaje continuo y la excelencia técnica.
            </p>

            {/* Soft Skills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white/90 text-sm flex items-center gap-2"
                >
                  <span>{skill.icon}</span>
                  {skill.text}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">2017</div>
                <div className="text-white/60 text-xs">Inicio</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">50+</div>
                <div className="text-white/60 text-xs">Proyectos</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">100+</div>
                <div className="text-white/60 text-xs">Estudiantes</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">10+</div>
                <div className="text-white/60 text-xs">Tecnologías</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technologies Section - Collapsible */}
        <motion.div variants={itemVariants} className="mb-12">
          <button
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛠️</span>
              <h3 className="text-xl font-bold text-white">
                Tecnologías & Herramientas
              </h3>
            </div>
            <motion.div
              animate={{ rotate: showAllSkills ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: showAllSkills ? 'auto' : 0,
              opacity: showAllSkills ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6">
              {/* Lenguajes */}
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                  <span>💬</span> Lenguajes
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg px-4 py-3 text-white text-center text-sm font-medium hover:bg-white/20 transition-all duration-200"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Frameworks */}
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                  <span>⚙️</span> Frameworks
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {frameworks.map((framework, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-center text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200"
                    >
                      {framework}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Servicios
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{service.icon}</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {service.title}
                    </h4>
                    <p className="text-white/60 text-sm">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
