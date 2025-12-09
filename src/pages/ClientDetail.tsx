import React from 'react';
import { useParams } from 'react-router-dom';
import ClientProfileCard from '../components/client/ClientProfileCard';
import { MOCK_CLIENT } from '../mocks/clients.mock';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, we would fetch the client by ID here.
  // For now, we just use the mock client.
  const client = MOCK_CLIENT;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
        <span>Clients</span>
        <span>/</span>
        <span className="text-white">{client.name}</span>
      </div>

      <ClientProfileCard client={client} />

      {/* Placeholder for other client details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
            <div className="text-neutral-400 text-sm text-center py-8 border border-dashed border-neutral-800 rounded-lg">
              No active projects found.
            </div>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
            <div className="text-neutral-400 text-sm text-center py-8 border border-dashed border-neutral-800 rounded-lg">
              No recent invoices.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>
            <textarea 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none h-32"
              placeholder="Add a note about this client..."
            ></textarea>
            <button className="mt-3 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
