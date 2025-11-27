import React from 'react';
import { PROJECTS, INVOICES, TICKETS, getProjectStats } from '../services/mockData';
import { ProjectCard } from '../components/organisms/ProjectCard';
import { DashboardReviewsWidget } from '../components/reviews';
import { useNavigate } from 'react-router-dom';
import { Activity, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; trend?: string }> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-neutral-400 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-neutral-800 rounded-lg text-brand">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && <p className="text-xs text-brand mt-4 font-medium">{trend} from last month</p>}
  </div>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = getProjectStats();
  
  // Custom palette from props
  const COLORS = ['#1dcd9f', '#169976', '#404040'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="bg-brand text-black px-4 py-2 rounded-lg font-semibold hover:bg-brand-dark transition-colors">
          + New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231" icon={DollarSign} trend="+12.5%" />
        <StatCard title="Active Projects" value="5" icon={Activity} />
        <StatCard title="Pending Tickets" value="8" icon={Clock} />
        <StatCard title="Tasks Completed" value="124" icon={CheckCircle} trend="+4.3%" />
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Status Chart */}
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800 lg:col-span-2">
           <h2 className="text-lg font-bold text-white mb-6">Project Overviews</h2>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats}>
                 <XAxis dataKey="name" stroke="#737373" />
                 <YAxis stroke="#737373" />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#222', borderColor: '#404040', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: '#ffffff10' }}
                 />
                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                   {stats.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

     

        {/* Recent Activity / Invoices */}
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Recent Invoices</h2>
          <div className="space-y-4 flex-1">
            {INVOICES.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors">
                <div>
                  <p className="text-white font-medium">{inv.id}</p>
                  <p className="text-sm text-neutral-400">{inv.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${inv.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/invoices')} className="w-full mt-6 py-2 text-sm text-brand font-medium hover:text-white transition-colors">
            View All Invoices
          </button>
        </div>
      </div>

      {/* Widget Row: Active Projects + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-white">Active Projects</h2>
             <button onClick={() => navigate('/projects')} className="text-sm text-neutral-400 hover:text-white transition-colors">See all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={(id) => navigate(`/projects/${id}`)} 
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <DashboardReviewsWidget />
        </div>
      </div>
    </div>
  );
};
