'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github?: string;
  demo?: string;
  category: string;
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  // Proyectos de Carlos Sánchez
  const projects: Project[] = [
    {
      id: 1,
      title: 'Visualizador de Algoritmos',
      description: 'Aplicación educativa interactiva que permite explorar y comprender algoritmos fundamentales con animaciones paso a paso. Incluye el Algoritmo de Euclides para el MCD y el Algoritmo de Dijkstra para encontrar rutas más cortas en grafos.',
      technologies: ['React', 'JavaScript', 'CSS3', 'Animaciones'],
      image: '/projects/algoritmos.png',
      demo: 'https://charly-sanchez.github.io/Dijkstra_Euclides_ProyectUMG/',
      category: 'Web App',
    },
    {
      id: 2,
      title: 'Restaurante El Tambor Oasis',
      description: 'Sitio web completo para restaurante y hotel con sistema de reservaciones online. Diseño atractivo que resalta la gastronomía y servicios. Incluye menú interactivo, galería de fotos y información de contacto.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      image: '/projects/tambor-oasis.png',
      demo: 'https://www.eltamboroasis.com',
      category: 'Web Corporativa',
    },
    {
      id: 3,
      title: 'Colegio San Felipe',
      description: 'Portal educativo moderno para colegio con información institucional, servicios académicos y sistema de avisos. Diseño limpio y profesional enfocado en la experiencia del usuario y accesibilidad.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      image: '/projects/colegio-sanfelipe.jpg',
      demo: 'https://colsanfelipe.es/',
      category: 'Web Educativa',
    },
    {
      id: 4,
      title: 'Colegio Galileo Galilei',
      description: 'Plataforma web para institución educativa pre-universitaria donde trabajo como docente. Incluye información académica, galería de actividades, y sistema de contacto para futuros estudiantes.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design'],
      image: '/projects/colegio-galilei.jpg',
      demo: 'https://www.colgalileoantigua.edu.gt/index.html',
      category: 'Web Educativa',
    },
  ];

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 md:py-32"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto w-full"
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Mis{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Proyectos
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mb-4"></div>
          <p className="text-white/60 text-lg">
            Algunos de los proyectos en los que he trabajado
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              {/* Image Container */}
              <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                  {project.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-white/80 hover:text-blue-400 transition-colors text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: selectedProject === project.id ? 'auto' : 0,
                  opacity: selectedProject === project.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="p-6 bg-white/5">
                  <p className="text-white/70 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/Charly-Sanchez"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-colors duration-300"
          >
            Ver más en GitHub
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
