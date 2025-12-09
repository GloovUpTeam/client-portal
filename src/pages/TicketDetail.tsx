import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketDetail as TicketDetailType } from '../types/tickets';
import { fetchTicketById } from '../services/ticketsService';
import { TicketChat } from '../components/tickets/TicketChat';
import { AttachmentList } from '../components/tickets/AttachmentList';
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Activity,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetailType | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'activity'>('chat');

  useEffect(() => {
    if (id) {
      fetchTicketById(id).then(({ data }) => {
        if (data) {
            // Map DB ticket to TicketDetailType
            const mappedTicket: TicketDetailType = {
                id: data.id,
                title: data.title,
                description: data.description || '',
                priority: (data.priority as any) || 'Medium',
                status: (data.status as any) || 'Open',
                creatorId: data.client_id || '',
                creator: { id: data.client_id || '', name: 'User', email: '', avatar: '', role: 'Client' },
                assigneeId: data.assigned_to,
                attachments: [], // TODO: fetch attachments
                comments: [], // TODO: fetch comments
                activities: [], // TODO: fetch activities
                createdAt: data.created_at || new Date().toISOString(),
                updatedAt: data.created_at || new Date().toISOString(),
                progress: 0
            };
            setTicket(mappedTicket);
        } else {
            navigate('/tickets');
        }
      });
    }
  }, [id, navigate]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="text-neutral-400 mt-4">Loading ticket...</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'In Progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Closed':
        return 'bg-neutral-700 text-neutral-400 border-neutral-600';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'Open':
        return <AlertCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const handleAddComment = (input: any) => {
    try {
      const newComment = ticketsService.addComment(input);
      // Refresh ticket data
      const updatedTicket = ticketsService.getTicketById(ticket.id);
      if (updatedTicket) {
        setTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleStatusChange = (newStatus: TicketDetailType['status']) => {
    try {
      const updatedTicket = ticketsService.updateTicketStatus(ticket.id, newStatus);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = (newPriority: TicketDetailType['priority']) => {
    try {
      const updatedTicket = ticketsService.updateTicketPriority(ticket.id, newPriority);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    try {
      const updatedTicket = ticketsService.removeAttachment(ticket.id, attachmentId);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Error removing attachment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <button
            onClick={() => navigate('/tickets')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-neutral-500">{ticket.id}</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">{ticket.title}</h1>
          <p className="text-neutral-400">{ticket.description}</p>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
            ticket.status
          )}`}
        >
          {getStatusIcon(ticket.status)}
          {ticket.status}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-300">Progress</span>
          <span className="text-sm font-bold text-brand">{ticket.progress}%</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-brand h-full transition-all duration-500"
            style={{ width: `${ticket.progress}%` }}
            role="progressbar"
            aria-valuenow={ticket.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Chat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-surface border border-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Created by</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={ticket.creator.avatar}
                  alt={ticket.creator.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-white font-medium">{ticket.creator.name}</p>
                  <p className="text-xs text-neutral-500">{ticket.creator.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface border border-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Assigned to</span>
              </div>
              {ticket.assignee ? (
                <div className="flex items-center gap-2">
                  <img
                    src={ticket.assignee.avatar}
                    alt={ticket.assignee.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{ticket.assignee.name}</p>
                    <p className="text-xs text-neutral-500">{ticket.assignee.role}</p>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500">Unassigned</p>
              )}
            </div>

            <div className="bg-brand-surface border border-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Created</span>
              </div>
              <p className="text-white font-medium">{formatDate(ticket.createdAt)}</p>
            </div>

            <div className="bg-brand-surface border border-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Last updated</span>
              </div>
              <p className="text-white font-medium">{formatDate(ticket.updatedAt)}</p>
            </div>
          </div>

          {/* Attachments */}
          {ticket.attachments.length > 0 && (
            <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
              <AttachmentList
                attachments={ticket.attachments}
                onRemove={handleRemoveAttachment}
                showRemove={true}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="bg-brand-surface border border-neutral-800 rounded-xl overflow-hidden">
            <div className="border-b border-neutral-800 flex">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-neutral-900 text-brand border-b-2 border-brand'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Chat ({ticket.comments.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'activity'
                    ? 'bg-neutral-900 text-brand border-b-2 border-brand'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Activity ({ticket.activities.length})
              </button>
            </div>

            <div className="h-[500px]">
              {activeTab === 'chat' ? (
                <TicketChat
                  ticketId={ticket.id}
                  comments={ticket.comments}
                  onAddComment={handleAddComment}
                />
              ) : (
                <div className="p-4 overflow-y-auto h-full">
                  <div className="space-y-4">
                    {ticket.activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.description}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Actions</h3>

            {/* Status Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as TicketDetailType['status'])}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand transition-colors"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Priority</label>
              <select
                value={ticket.priority}
                onChange={(e) =>
                  handlePriorityChange(e.target.value as TicketDetailType['priority'])
                }
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-white mb-4">Statistics</h3>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Comments</span>
              <span className="text-white font-medium">{ticket.comments.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Attachments</span>
              <span className="text-white font-medium">{ticket.attachments.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Activities</span>
              <span className="text-white font-medium">{ticket.activities.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
