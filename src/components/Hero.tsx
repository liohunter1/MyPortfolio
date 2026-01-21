import React from 'react';
import { Lock, Terminal, Database } from 'lucide-react';
import { PhoenixIcon } from './icons/Phoenix';

export default function Hero() {
  const skills = [
    { icon: PhoenixIcon, label: 'Penetration Testing' },
    { icon: Lock, label: 'Security Auditing' },
    { icon: Terminal, label: 'Threat Analysis' },
    { icon: Database, label: 'Secure Architecture' },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-7xl w-full">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Emilio Ogega
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Cybersecurity Professional | Building secure systems. Finding vulnerabilities. Protecting infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-lg p-6 transition-all"
              >
                <skill.icon className="w-8 h-8 text-gray-900 mx-auto mb-3" aria-label={skill.label} />
                <p className="text-sm text-gray-600">{skill.label}</p>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <a
              href="#projects"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
            >
              View Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
