import { Github, Linkedin, Mail } from 'lucide-react';
import { PhoenixIcon } from './icons/Phoenix';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-50 border-t border-gray-200 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PhoenixIcon className="w-6 h-6 text-gray-900" title="Phoenix" />
              <span className="text-xl font-bold text-gray-900">Emilio Ogega</span>
            </div>
            <p className="text-gray-600 text-sm">
              Building secure systems and protecting digital infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <a href="#home" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Home
              </a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Projects
              </a>
              <a href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Blog
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:emilio.ogega@example.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} Emilio Ogega. Built with security in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
