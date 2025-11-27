import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../services/mockData';
import { ProjectCard } from '../components/organisms/ProjectCard';
import { Button } from '../components/atoms/Button';
import { Plus, Search, Filter } from 'lucide-react';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = PROJECTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold text-white">Projects</h1>
           <p className="text-neutral-400 mt-1">Manage and track all your active client projects.</p>
        </div>
        <Button onClick={() => console.log('New Project')}>
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-brand-surface p-4 rounded-xl border border-neutral-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-colors"
          />
        </div>
        <Button variant="secondary" className="shrink-0">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={(id) => navigate(`/projects/${id}`)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-surface border border-neutral-800 rounded-xl">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No projects found</h3>
          <p className="text-neutral-400 mt-1">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;