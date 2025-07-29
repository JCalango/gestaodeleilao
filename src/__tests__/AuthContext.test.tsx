import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

// Mock do Supabase
jest.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    })),
    rpc: jest.fn(() => Promise.resolve())
  }
}));

// Componente de teste para usar o hook
const TestComponent = () => {
  const { signIn, loading, isRefreshing, refreshData } = useAuth();
  
  return (
    <div>
      <button onClick={() => signIn('test@test.com', 'password')}>
        Sign In
      </button>
      <button onClick={refreshData}>
        Refresh Data
      </button>
      <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
      <div data-testid="refreshing">{isRefreshing ? 'refreshing' : 'not refreshing'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o provider sem erros', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
  });

  test('deve chamar signIn quando o botão for clicado', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ error: null });
    (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(mockSignIn);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      });
    });
  });

  test('deve mostrar estado de carregamento durante o login', async () => {
    const mockSignIn = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );
    (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(mockSignIn);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    // Deve mostrar loading durante o processo
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });
  });

  test('deve mostrar estado de refreshing durante a atualização de dados', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Refresh Data'));

    // Deve mostrar refreshing durante o processo
    expect(screen.getByTestId('refreshing')).toHaveTextContent('refreshing');

    await waitFor(() => {
      expect(screen.getByTestId('refreshing')).toHaveTextContent('not refreshing');
    });
  });

  test('deve lidar com erro de login', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ 
      error: { message: 'Invalid login credentials' } 
    });
    (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(mockSignIn);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });
});

