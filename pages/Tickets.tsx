import React from 'react';
import { TICKETS } from '../services/mockData';
import { Button } from '../components/atoms/Button';
import { Filter, Plus } from 'lucide-react';

export const Tickets: React.FC = () => {
  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Tickets</h1>
          <p className="text-neutral-400 mt-1">Track issues and feature requests.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Ticket</Button>
        </div>
      </div>

      <div className="bg-brand-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="p-4 font-medium text-neutral-400 text-sm">ID</th>
                <th className="p-4 font-medium text-neutral-400 text-sm w-1/2">Title</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Status</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Priority</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Assignee</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((ticket) => (
                <tr key={ticket.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                  <td className="p-4 text-sm font-mono text-neutral-500">{ticket.id}</td>
                  <td className="p-4">
                    <span className="text-white font-medium group-hover:text-brand transition-colors block">{ticket.title}</span>
                    <span className="text-xs text-neutral-500">{ticket.messages} comments</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-800 text-neutral-300">
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.assignee && (
                      <div className="flex items-center gap-2">
                        <img src={ticket.assignee.avatar} className="w-6 h-6 rounded-full" alt="" />
                        <span className="text-sm text-neutral-300">{ticket.assignee.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-neutral-500">{new Date(ticket.createdDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};