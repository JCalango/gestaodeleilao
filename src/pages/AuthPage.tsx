import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AuthPage: React.FC = () => {
  const { signIn, loading, isRefreshing } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu email e senha.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Por favor, confirme seu email antes de fazer login.";
      }
      
      toast({
        title: "Erro no Login",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Carregando dados...",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">GBI Leilões</h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base">Sistema de Gestão de Leilões</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl text-slate-800">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Entre com sua conta autorizada
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            {/* Indicador de carregamento durante refresh */}
            {isRefreshing && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">Atualizando dados...</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label 
                  htmlFor="signin-email" 
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 px-4 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label 
                  htmlFor="signin-password" 
                  className="text-sm font-medium text-slate-700"
                >
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 px-4 pr-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg" 
                disabled={loading || isRefreshing}
              >
                {(loading || isRefreshing) && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                {loading 
                  ? 'Entrando...' 
                  : isRefreshing 
                  ? 'Atualizando dados...' 
                  : 'Entrar no Sistema'
                }
              </Button>
            </form>

            {/* Aviso do Sistema */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Sistema Restrito</p>
                  <p className="text-blue-700 leading-relaxed">
                    O acesso é controlado pelo administrador. Para obter uma conta, 
                    entre em contato com o administrador do sistema.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            © 2024 Prefeitura Municipal de Guanambi
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
