import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from './auth-context';

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      // Simulate an unauthenticated state immediately
      callback(null);
      return () => {}; // Unsubscribe function
    }),
  }
}));

// Test component to consume context
const TestComponent = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Unauthenticated</div>;
  return <div>Logged in as {user.email}</div>;
};

describe('Auth Context', () => {
  it('provides initial unauthenticated state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state is loading, then transitions to unauthenticated
    await waitFor(() => {
      expect(screen.getByText('Unauthenticated')).toBeInTheDocument();
    });
  });
});
