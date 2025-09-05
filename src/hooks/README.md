# useUserData Hook

Um hook React customizado que carrega automaticamente todos os dados do usuário após o login.

## Características

- **Carregamento Automático**: Carrega dados automaticamente após o usuário fazer login
- **Cache Inteligente**: Evita chamadas desnecessárias usando cache por tempo configurável
- **Retry Automático**: Tenta novamente em caso de erro com backoff exponencial
- **Tempo Real**: Escuta mudanças em tempo real para recarregar dados quando necessário
- **Estados Completos**: Gerencia loading, error e success de forma consistente
- **Cancelamento**: Cancela requisições anteriores para evitar race conditions

## Uso Básico

```typescript
import { useUserData } from '@/hooks/useUserData';

function MyComponent() {
  const {
    data,      // Dados do usuário ou null
    loading,   // Estado de carregamento
    error,     // Mensagem de erro ou null
    refetch,   // Função para recarregar manualmente
    clearError,// Função para limpar erro
    isStale    // Função para verificar se dados estão desatualizados
  } = useUserData();

  if (loading && !data) {
    return <div>Carregando...</div>;
  }

  if (error && !data) {
    return <div>Erro: {error}</div>;
  }

  if (!data) {
    return <div>Nenhum dado encontrado</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {data.profile.full_name}!</h1>
      <p>Você tem {data.recent_vistorias.length} vistorias recentes</p>
    </div>
  );
}
```

## Uso Avançado

```typescript
const {
  data,
  loading,
  error,
  refetch,
  clearError,
  isStale
} = useUserData({
  enableAutoRefetch: true,    // Carregar automaticamente após login (padrão: true)
  cacheMinutes: 10,          // Cache por 10 minutos (padrão: 5)
  retryAttempts: 5,          // 5 tentativas em caso de erro (padrão: 3)
  showToastOnError: false    // Não mostrar toast de erro (padrão: true)
});

// Verificar se dados estão desatualizados
if (isStale(15)) { // 15 minutos
  console.log('Dados desatualizados há mais de 15 minutos');
}

// Recarregar dados manualmente
const handleRefresh = async () => {
  await refetch();
};
```

## Estrutura dos Dados Retornados

```typescript
interface UserDashboardData {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'member';
    created_at: string;
    updated_at: string;
  };
  recent_vistorias: any[];      // 10 vistorias mais recentes
  recent_assessments: any[];    // 10 avaliações mais recentes
  loaded_at: number;           // Timestamp de quando foi carregado
}
```

## Como Funciona

1. **Inicialização**: O hook monitora o estado de autenticação
2. **Login Detectado**: Quando o usuário faz login, automaticamente carrega os dados
3. **Cache**: Dados são mantidos em cache pelo tempo configurado
4. **Tempo Real**: Escuta mudanças na tabela `user_activities` para recarregar quando necessário
5. **Cleanup**: Cancela requisições pendentes quando o componente é desmontado

## Requisitos

- Usuário deve estar autenticado
- Função `get_user_dashboard_data` deve existir no banco de dados
- Hook `useAuth` deve estar disponível no contexto

## Dependências

- `@/contexts/AuthContext` - Para estado de autenticação
- `@/integrations/supabase/client` - Para chamadas ao banco
- `@/hooks/use-toast` - Para notificações de erro

## Exemplo Completo

Veja `src/examples/UserDataExample.tsx` para um exemplo completo de como usar o hook com todos os estados e funcionalidades.