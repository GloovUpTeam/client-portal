import React from 'react';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  PlusCircle, 
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { Client } from '../../mocks/clients.mock';
import { useNavigate } from 'react-router-dom';

interface ClientProfileCardProps {
  client: Client;
}

const ClientProfileCard: React.FC<ClientProfileCardProps> = ({ client }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Paused': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
            <Building2 className="w-8 h-8 text-neutral-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {client.name}
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </h2>
            <div className="flex items-center gap-3 text-sm text-neutral-400 mt-1">
              <span>ID: {client.clientId}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
              <a 
                href={client.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Globe className="w-3 h-3" />
                {client.website.replace(/^https?:\/\//, '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => navigate(`/clients/${client.id}/edit`)}
            className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors border border-neutral-700"
          >
            <Edit className="w-4 h-4" />
            Edit Client
          </button>
          <button 
            onClick={() => navigate(`/tickets/create?clientId=${client.id}`)}
            className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-sm font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Raise Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-neutral-800">
        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Contact Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-neutral-500 mt-0.5" />
              <div>
                <p className="text-sm text-white">{client.email}</p>
                <p className="text-xs text-neutral-500">Primary Email</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-neutral-500 mt-0.5" />
              <div>
                <p className="text-sm text-white">{client.phone}</p>
                <p className="text-xs text-neutral-500">Phone Number</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
              <div>
                <p className="text-sm text-white">{client.address}</p>
                <p className="text-xs text-neutral-500">Billing Address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Dates & Services */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Services & Expiry</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Domain</p>
                  <p className="text-xs text-neutral-500">Expires {client.domainExpiry}</p>
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Active
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Hosting</p>
                  <p className="text-xs text-neutral-500">Expires {client.hostingExpiry}</p>
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Team Members</h3>
            <button className="text-xs text-neutral-400 hover:text-white transition-colors">View All</button>
          </div>
          <div className="flex -space-x-2 overflow-hidden py-1">
            {client.team.slice(0, 4).map((member) => (
              <div key={member.id} className="relative group">
                {member.avatar ? (
                  <img 
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-neutral-900 object-cover" 
                    src={member.avatar} 
                    alt={member.name} 
                  />
                ) : (
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-neutral-900 bg-neutral-800 text-xs font-medium text-white">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {member.name} - {member.role}
                </div>
              </div>
            ))}
            {client.team.length > 4 && (
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-neutral-900 bg-neutral-800 text-xs font-medium text-neutral-400">
                +{client.team.length - 4}
              </div>
            )}
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-neutral-900 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors border border-dashed border-neutral-600">
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            {client.team.length} people have access to this project
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileCard;
