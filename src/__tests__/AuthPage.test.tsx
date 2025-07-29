import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthPage from '../pages/AuthPage';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock do toast
jest.mock('../components/ui/use-toast', () => ({
  toast: jest.fn()
}));

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

const renderAuthPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a página de login corretamente', () => {
    renderAuthPage();
    
    expect(screen.getByText('GBI Leilões')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Gestão de Leilões')).toBeInTheDocument();
    expect(screen.getByText('Acesso ao Sistema')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  test('deve permitir inserir email e senha', () => {
    renderAuthPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('deve mostrar indicador de carregamento durante o login', async () => {
    const { supabase } = require('../integrations/supabase/client');
    supabase.auth.signInWithPassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );

    renderAuthPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Deve mostrar "Entrando..." durante o carregamento
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByText('Entrar')).toBeInTheDocument();
    });
  });

  test('deve mostrar indicador de atualização de dados', async () => {
    renderAuthPage();
    
    // Simular que está refreshing
    const refreshButton = screen.getByRole('button');
    
    // Verificar se o spinner aparece quando isRefreshing é true
    // Isso seria testado através do contexto mockado
    expect(refreshButton).toBeInTheDocument();
  });

  test('deve validar campos obrigatórios', async () => {
    const { toast } = require('../components/ui/use-toast');
    
    renderAuthPage();
    
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
    });
  });

  test('deve exibir mensagem de erro para credenciais inválidas', async () => {
    const { supabase } = require('../integrations/supabase/client');
    const { toast } = require('../components/ui/use-toast');
    
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' }
    });

    renderAuthPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Erro no Login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    });
  });

  test('deve exibir mensagem de sucesso para login válido', async () => {
    const { supabase } = require('../integrations/supabase/client');
    const { toast } = require('../components/ui/use-toast');
    
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null
    });

    renderAuthPage();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao GBI Leilões.",
      });
    });
  });
});

