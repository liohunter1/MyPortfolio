import { useState, useEffect, type ComponentType } from 'react';
import { Lock, Terminal, Network, Github, ExternalLink, Star, GitFork } from 'lucide-react';
import { PhoenixIcon } from './icons/Phoenix';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork?: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  icon: ComponentType<{ className?: string }>;
  github: string;
  demo: string | null;
  stars: number;
  forks: number;
  topics: string[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [allTopics, setAllTopics] = useState<string[]>([]);

  // GitHub username
  const GITHUB_USERNAME = 'liohunter1';
  
  // 🎯 PORTFOLIO FILTER: Only show repos with these topics
  // Add "portfolio" topic to repos you want to showcase on GitHub
  const PORTFOLIO_TOPICS: string[] = ['portfolio'];
  
  // Alternative: Repo name whitelist (leave empty if using topics)
  const REPO_WHITELIST: string[] = [];

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  const fetchGitHubRepos = async () => {
    try {
      const headers: HeadersInit = {};
      if (import.meta.env.VITE_GITHUB_TOKEN) {
        headers['Authorization'] = `token ${import.meta.env.VITE_GITHUB_TOKEN}`;
      }

      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const repos: GitHubRepo[] = await response.json();
      
      // Filter logic
      let filteredRepos = repos
        .filter(repo => !repo.fork) // Remove forked repos
        .filter(repo => !repo.name.includes('config')); // Remove config repos

      // Apply portfolio topics filter (if specified)
      if (PORTFOLIO_TOPICS.length > 0) {
        filteredRepos = filteredRepos.filter(repo =>
          repo.topics.some(topic => PORTFOLIO_TOPICS.includes(topic))
        );
      }

      // Apply whitelist filter (if specified)
      if (REPO_WHITELIST.length > 0) {
        filteredRepos = filteredRepos.filter(repo =>
          REPO_WHITELIST.includes(repo.name)
        );
      }

      // Limit to 10 projects
      const formattedProjects: Project[] = filteredRepos
        .slice(0, 10)
        .map((repo, index) => ({
          id: repo.id,
          title: repo.name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          description: repo.description || 'No description available',
          tech: repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : ['Code']),
          icon: getIconForRepo(index),
          github: repo.html_url,
          demo: repo.homepage,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics,
        }));

      // Extract all unique topics
      const uniqueTopics = Array.from(
        new Set(formattedProjects.flatMap(p => p.topics))
      ).sort();

      setProjects(formattedProjects);
      setAllTopics(uniqueTopics);
      setLoading(false);
    } catch (err) {
      setError('Unable to load GitHub projects');
      setLoading(false);
      console.error('Error fetching repos:', err);
    }
  };

  const getIconForRepo = (index: number) => {
    const icons = [PhoenixIcon, Lock, Terminal, Network, PhoenixIcon, Lock];
    return icons[index % icons.length];
  };

  // Filter projects by selected topic
  const filteredProjects = selectedTopic === 'All'
    ? projects
    : projects.filter(p => p.topics.includes(selectedTopic));

  if (loading) {
    return (
      <section id="projects" className="min-h-screen px-6 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Projects</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Loading projects from GitHub...
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="min-h-screen px-6 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Projects</h2>
            <p className="text-lg text-red-600">{error}</p>
            <p className="text-sm text-gray-600">
              Update your GitHub username in Projects.tsx (line 31)
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="min-h-screen px-6 py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Projects</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Security tools and systems from my GitHub repositories.
            {filteredProjects.length > 0 && ` Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Topic Filter Buttons */}
        {allTopics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedTopic('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTopic === 'All'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Projects ({projects.length})
            </button>
            {allTopics.map((topic) => {
              const count = projects.filter(p => p.topics.includes(topic)).length;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTopic === topic
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {topic} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-lg p-8 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <project.icon className="w-10 h-10 text-gray-900" aria-label={project.title} />
                  <div className="flex space-x-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.forks}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
