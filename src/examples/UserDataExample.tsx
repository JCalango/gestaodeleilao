import React from 'react';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner, ErrorState, SuccessState } from '@/components/ui/loading-states';
import { RefreshCw, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Exemplo de como usar o hook useUserData em um componente
 */
export function UserDataExample() {
  const { user } = useAuth();
  
  // Usar o hook com configurações personalizadas
  const {
    data,
    loading,
    error,
    refetch,
    clearError,
    isStale
  } = useUserData({
    enableAutoRefetch: true,
    cacheMinutes: 5,
    retryAttempts: 3,
    showToastOnError: true
  });

  // Se não está logado
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Faça login para ver seus dados
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dados do Usuário</h1>
        <div className="flex items-center gap-2">
          {isStale() && (
            <Badge variant="outline" className="text-orange-600">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Dados desatualizados
            </Badge>
          )}
          {!isStale() && data && (
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Dados atualizados
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estado de Loading */}
      {loading && !data && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" text="Carregando dados do usuário..." />
          </CardContent>
        </Card>
      )}

      {/* Estado de Erro */}
      {error && !data && (
        <Card>
          <CardContent className="p-6">
            <ErrorState
              message={error}
              onRetry={refetch}
            />
            <div className="mt-4">
              <Button variant="outline" onClick={clearError}>
                Limpar Erro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de Sucesso com Dados */}
      {data && (
        <>
          {/* Mostrar erro se houver, mas manter dados visíveis */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={clearError}>
                  Dispensar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Informações do Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-lg">{data.profile.full_name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{data.profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Papel</label>
                  <Badge variant={data.profile.role === 'admin' ? 'default' : 'secondary'}>
                    {data.profile.role === 'admin' ? 'Administrador' : 'Membro'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Membro desde</label>
                  <p className="text-lg">
                    {new Date(data.profile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vistorias Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Vistorias Recentes
                <Badge variant="outline">{data.recent_vistorias.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recent_vistorias.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma vistoria encontrada
                </p>
              ) : (
                <div className="space-y-2">
                  {data.recent_vistorias.slice(0, 5).map((vistoria: any, index: number) => (
                    <div
                      key={vistoria.id || index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {vistoria.numero_controle || `Vistoria ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vistoria.placa ? `Placa: ${vistoria.placa}` : 'Sem placa informada'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {vistoria.created_at
                            ? new Date(vistoria.created_at).toLocaleDateString('pt-BR')
                            : 'Data não informada'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                  {data.recent_vistorias.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      E mais {data.recent_vistorias.length - 5} vistorias...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Avaliações de Danos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Avaliações de Danos Recentes
                <Badge variant="outline">{data.recent_assessments.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recent_assessments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma avaliação de danos encontrada
                </p>
              ) : (
                <div className="space-y-2">
                  {data.recent_assessments.slice(0, 5).map((assessment: any, index: number) => (
                    <div
                      key={assessment.id || index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          Avaliação {assessment.vistoria_id || `#${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tipo: {assessment.vehicle_type || 'Não informado'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-1 mb-1">
                          {typeof assessment.total_sim_count === 'number' && (
                            <Badge variant="destructive" className="text-xs">
                              SIM: {assessment.total_sim_count}
                            </Badge>
                          )}
                          {typeof assessment.total_nao_count === 'number' && (
                            <Badge variant="secondary" className="text-xs">
                              NÃO: {assessment.total_nao_count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {assessment.created_at
                            ? new Date(assessment.created_at).toLocaleDateString('pt-BR')
                            : 'Data não informada'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                  {data.recent_assessments.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      E mais {data.recent_assessments.length - 5} avaliações...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações de Cache */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informações de Cache</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Dados carregados em:</strong>{' '}
                  {new Date(data.loaded_at * 1000).toLocaleString('pt-BR')}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {isStale() ? 'Desatualizados' : 'Atualizados'}
                </p>
                {loading && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <LoadingSpinner size="sm" />
                    <span>Atualizando dados...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Estado vazio - usuário logado mas sem dados e sem carregamento */}
      {!loading && !error && !data && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum dado encontrado
              </p>
              <Button onClick={refetch}>
                Carregar Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}