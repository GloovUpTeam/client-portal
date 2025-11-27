import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../services/mockData';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { Button } from '../components/atoms/Button';
import { ArrowLeft, Paperclip, CheckSquare, MessageSquare, Clock } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return <div className="text-white">Project not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'files', label: 'Files' },
    { id: 'updates', label: 'Updates' },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="pl-0 text-neutral-400 hover:text-brand">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
      </Button>

      {/* Header */}
      <div className="bg-brand-surface p-8 rounded-2xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-display font-bold text-white">{project.name}</h1>
               <span className="px-3 py-1 bg-brand/20 text-brand text-xs rounded-full font-medium border border-brand/20">
                 {project.status}
               </span>
            </div>
            <p className="text-neutral-400 max-w-2xl">
              Project for <span className="text-white font-medium">{project.client}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3 mr-4">
              {project.team.map(u => (
                <img key={u.id} src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full border-2 border-brand-surface" />
              ))}
            </div>
            <Button>Edit Project</Button>
          </div>
        </div>

        <div className="mt-8 max-w-xl">
          <ProgressBar value={project.progress} label="Overall Progress" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
           {activeTab === 'overview' && (
             <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
               <h3 className="text-lg font-bold text-white mb-4">Description</h3>
               <p className="text-neutral-400 leading-relaxed">
                 This project aims to completely revitalize the client's web presence. 
                 It includes a full UX audit, new UI design system based on their rebrand, 
                 and a React-based frontend implementation.
               </p>
               
               <h3 className="text-lg font-bold text-white mt-8 mb-4">Key Deliverables</h3>
               <ul className="space-y-3">
                 {['High-fidelity Mockups', 'Interactive Prototype', 'React Component Library', 'Production Deployment'].map((item, i) => (
                   <li key={i} className="flex items-center text-neutral-300">
                     <CheckSquare className="w-5 h-5 text-brand mr-3" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
           )}
           
           {activeTab === 'files' && (
             <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
               <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center hover:border-brand/50 transition-colors cursor-pointer">
                 <Paperclip className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                 <p className="text-white font-medium">Drop files here or click to upload</p>
                 <p className="text-sm text-neutral-500 mt-1">Support for PNG, PDF, FIG (Max 10MB)</p>
               </div>
               
               <div className="mt-6 space-y-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center text-xs font-bold text-white">PDF</div>
                       <div>
                         <p className="text-sm font-medium text-white">Project_Brief_v{i}.pdf</p>
                         <p className="text-xs text-neutral-500">2.4 MB • Uploaded yesterday</p>
                       </div>
                     </div>
                     <Button variant="ghost" size="sm">Download</Button>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
             <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Next Milestone</h3>
             {project.nextMilestone && (
               <div className="bg-brand/10 border border-brand/20 p-4 rounded-lg">
                 <div className="flex items-center gap-3 mb-2">
                   <Clock className="w-5 h-5 text-brand" />
                   <span className="font-bold text-white">{project.nextMilestone.title}</span>
                 </div>
                 <p className="text-sm text-neutral-400 ml-8">Due: {project.nextMilestone.date}</p>
               </div>
             )}
          </div>
          
          <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
             <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Project Activity</h3>
             <div className="space-y-6 border-l-2 border-neutral-800 pl-4 ml-2">
               {[1,2,3].map(i => (
                 <div key={i} className="relative">
                   <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-neutral-600 border-2 border-brand-surface"></div>
                   <p className="text-sm text-white">Alice uploaded new designs</p>
                   <p className="text-xs text-neutral-500 mt-1">2 hours ago</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};