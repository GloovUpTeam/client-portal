// src/tests/settings/Settings.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Settings } from '../../pages/Settings';

describe('Settings Page', () => {
  it('renders settings page with all tabs', () => {
    render(<Settings />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    render(<Settings />);
    
    // Profile tab should be active by default
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    
    // Click Notifications tab
    const notificationsTab = screen.getAllByText('Notifications')[0];
    fireEvent.click(notificationsTab);
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    
    // Click Security tab
    const securityTab = screen.getAllByText('Security')[0];
    fireEvent.click(securityTab);
    expect(screen.getByText('Security Settings')).toBeInTheDocument();
  });

  it('renders profile form with user data', () => {
    render(<Settings />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    expect(nameInput).toHaveValue('Alice Freeman');
    expect(emailInput).toHaveValue('alice.freeman@gloovup.com');
  });

  it('validates required fields in profile form', async () => {
    render(<Settings />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    
    // Clear name field
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });
  });

  it('shows success message after saving profile', async () => {
    render(<Settings />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    
    // Update name
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    // Wait for button to be enabled (isDirty check)
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
    
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('enables cancel button when form is dirty', async () => {
    render(<Settings />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    // Initially disabled
    expect(cancelButton).toBeDisabled();
    
    // Make changes
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    await waitFor(() => {
      expect(cancelButton).not.toBeDisabled();
    });
  });
});
