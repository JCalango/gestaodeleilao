
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AuthGuard from '@/components/Auth/AuthGuard';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

const UsersManagement: React.FC = () => {
  const { profile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'member' as 'admin' | 'member'
  });

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create user via Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          full_name: formData.full_name,
          role: formData.role
        }
      });

      if (error) {
        throw error;
      }

      // Update the profile with the correct role if needed
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ role: formData.role })
          .eq('id', data.user.id);
      }

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });

      setIsCreateDialogOpen(false);
      setFormData({ full_name: '', email: '', password: '', role: 'member' });
      fetchProfiles();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfile || !formData.full_name || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProfile.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });

      setIsEditDialogOpen(false);
      setSelectedProfile(null);
      setFormData({ full_name: '', email: '', password: '', role: 'member' });
      fetchProfiles();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });

      fetchProfiles();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (profile: Profile) => {
    setSelectedProfile(profile);
    setFormData({
      full_name: profile.full_name,
      email: profile.email,
      password: '',
      role: profile.role
    });
    setIsEditDialogOpen(true);
  };

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Usuários</h1>
            <p className="text-slate-600">Gerencie usuários e suas permissões no sistema</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Adicione um novo usuário ao sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-name">Nome Completo</Label>
                    <Input
                      id="create-name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-email">Email</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-password">Senha</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-role">Função</Label>
                    <Select value={formData.role} onValueChange={(value: 'admin' | 'member') => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Membro</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Usuário'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários do Sistema
            </CardTitle>
            <CardDescription>
              Lista de todos os usuários cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && profiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Carregando usuários...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.full_name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role === 'admin' ? 'Administrador' : 'Membro'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(profile)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(profile.id)}
                            disabled={profile.id === profile?.id} // Prevent self-deletion
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Atualize as informações do usuário.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome Completo</Label>
                  <Input
                    id="edit-name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Função</Label>
                  <Select value={formData.role} onValueChange={(value: 'admin' | 'member') => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
};

export default UsersManagement;
