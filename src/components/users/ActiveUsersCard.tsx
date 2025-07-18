
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Circle } from 'lucide-react';
import { useActiveUsers } from '@/hooks/useActiveUsers';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ActiveUsersCard: React.FC = () => {
  const { activeUsers, isLoading } = useActiveUsers();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuários Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const onlineUsers = activeUsers.filter(user => user.isOnline);
  const recentUsers = activeUsers.filter(user => !user.isOnline && user.lastActivity);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Usuários Ativos
          <Badge variant="secondary" className="ml-auto">
            {onlineUsers.length} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usuários Online */}
        {onlineUsers.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Online agora</h4>
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Circle className="w-3 h-3 fill-green-500 text-green-500 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.full_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {user.role === 'admin' ? 'Admin' : 'Membro'}
                      </Badge>
                      {user.lastActivity && (
                        <span className="text-xs text-slate-500">
                          Ativo {formatDistanceToNow(new Date(user.lastActivity), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usuários Recentemente Ativos */}
        {recentUsers.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Recentemente ativo{recentUsers.length > 1 ? 's' : ''}
            </h4>
            <div className="space-y-2">
              {recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Circle className="w-3 h-3 fill-gray-400 text-gray-400 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.full_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {user.role === 'admin' ? 'Admin' : 'Membro'}
                      </Badge>
                      {user.lastActivity && (
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(user.lastActivity), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Todos os usuários offline */}
        {onlineUsers.length === 0 && recentUsers.length === 0 && activeUsers.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Usuários cadastrados</h4>
            <div className="space-y-2">
              {activeUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.full_name}
                    </p>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.role === 'admin' ? 'Admin' : 'Membro'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeUsers.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            Nenhum usuário encontrado
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveUsersCard;
