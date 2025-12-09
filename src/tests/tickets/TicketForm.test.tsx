import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TicketForm } from '../../components/tickets/TicketForm';

describe('TicketForm', () => {
  it('renders ticket form with all required fields', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();

    render(<TicketForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assign to/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();

    render(<TicketForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const submitButton = screen.getByText('Create Ticket');
    fireEvent.click(submitButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when valid', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();

    render(<TicketForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Ticket' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const submitButton = screen.getByText('Create Ticket');
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Ticket',
        description: 'Test Description',
      })
    );
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();

    render(<TicketForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockCancel).toHaveBeenCalled();
  });
});
