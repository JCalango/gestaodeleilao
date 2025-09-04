import React, { useState } from 'react';
import { z } from 'zod';
import { useSupabaseCRUD } from '@/hooks/useSupabaseCRUD';
import { useImageManagement } from '@/hooks/useImageManagement';
import { CRUDForm } from '@/components/forms/CRUDForm';
import { ImageUploadField } from '@/components/forms/ImageUploadField';
import { PageLoading, ErrorState, EmptyState, CardSkeleton } from '@/components/ui/loading-states';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Car } from 'lucide-react';

// Schema de validação para vistoria
const vistoriaSchema = z.object({
  numero_controle: z.string().min(1, 'Número de controle é obrigatório'),
  placa: z.string().min(7, 'Placa deve ter pelo menos 7 caracteres'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano_fabricacao: z.number().min(1900).max(new Date().getFullYear()),
  ano_modelo: z.number().min(1900).max(new Date().getFullYear() + 1),
  cor: z.string().min(1, 'Cor é obrigatória'),
  municipio: z.string().min(1, 'Município é obrigatório'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
  observacoes: z.string().optional(),
  // Campos de fotos serão gerenciados separadamente
  fotos_frente: z.array(z.string()).optional(),
  fotos_lateral_esquerda: z.array(z.string()).optional(),
  fotos_lateral_direita: z.array(z.string()).optional(),
  fotos_traseira: z.array(z.string()).optional(),
  fotos_chassi: z.array(z.string()).optional(),
  fotos_motor: z.array(z.string()).optional(),
});

type VistoriaFormData = z.infer<typeof vistoriaSchema>;

interface Vistoria extends VistoriaFormData {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// Componente principal do exemplo CRUD
export function VistoriaCRUDExample() {
  const [selectedVistoria, setSelectedVistoria] = useState<Vistoria | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Hook CRUD para vistorias
  const {
    state: { data: vistorias, loading, error, actionLoading },
    operations: { create, update, delete: deleteVistoria },
    utils: { refresh }
  } = useSupabaseCRUD<'vistorias', Vistoria>({
    tableName: 'vistorias',
    orderBy: { column: 'created_at', ascending: false },
    realtime: true // Habilita atualizações em tempo real
  });

  // Estados de imagem para o formulário
  const [formImages, setFormImages] = useState<Record<string, string[]>>({});

  // Manipuladores de ações
  const handleCreateVistoria = async (data: VistoriaFormData) => {
    const vistoriaWithPhotos = {
      ...data,
      ...formImages
    };
    
    const newVistoria = await create(vistoriaWithPhotos);
    if (newVistoria) {
      setIsFormOpen(false);
      setSelectedVistoria(null);
      setFormImages({});
    }
  };

  const handleUpdateVistoria = async (data: VistoriaFormData) => {
    if (!selectedVistoria) return;
    
    const vistoriaWithPhotos = {
      ...data,
      ...formImages
    };
    
    const updatedVistoria = await update(selectedVistoria.id, vistoriaWithPhotos);
    if (updatedVistoria) {
      setIsFormOpen(false);
      setSelectedVistoria(null);
      setFormImages({});
    }
  };

  const handleDeleteVistoria = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vistoria?')) {
      await deleteVistoria(id);
    }
  };

  const handleEditVistoria = (vistoria: Vistoria) => {
    setSelectedVistoria(vistoria);
    setFormImages({
      fotos_frente: vistoria.fotos_frente || [],
      fotos_lateral_esquerda: vistoria.fotos_lateral_esquerda || [],
      fotos_lateral_direita: vistoria.fotos_lateral_direita || [],
      fotos_traseira: vistoria.fotos_traseira || [],
      fotos_chassi: vistoria.fotos_chassi || [],
      fotos_motor: vistoria.fotos_motor || [],
    });
    setIsFormOpen(true);
  };

  const handleNewVistoria = () => {
    setSelectedVistoria(null);
    setFormImages({});
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedVistoria(null);
    setFormImages({});
  };

  // Renderização do loading inicial
  if (loading && vistorias.length === 0) {
    return <PageLoading title="Carregando vistorias..." description="Aguarde enquanto carregamos os dados" />;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Vistorias</h1>
          <p className="text-muted-foreground">Sistema completo de CRUD com gestão de imagens</p>
        </div>
        <Button onClick={handleNewVistoria}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Vistoria
        </Button>
      </div>

      {/* Estado de erro global */}
      {error && (
        <ErrorState
          message={error.message}
          onRetry={refresh}
        />
      )}

      {/* Formulário */}
      {isFormOpen && (
        <VistoriaForm
          vistoria={selectedVistoria}
          images={formImages}
          onImagesChange={setFormImages}
          onSubmit={selectedVistoria ? handleUpdateVistoria : handleCreateVistoria}
          onCancel={handleCancelForm}
          isLoading={actionLoading}
        />
      )}

      {/* Lista de vistorias */}
      <VistoriaList
        vistorias={vistorias}
        loading={loading}
        onEdit={handleEditVistoria}
        onDelete={handleDeleteVistoria}
      />
    </div>
  );
}

// Componente do formulário de vistoria
interface VistoriaFormProps {
  vistoria?: Vistoria | null;
  images: Record<string, string[]>;
  onImagesChange: (images: Record<string, string[]>) => void;
  onSubmit: (data: VistoriaFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function VistoriaForm({
  vistoria,
  images,
  onImagesChange,
  onSubmit,
  onCancel,
  isLoading = false
}: VistoriaFormProps) {
  const isEditing = !!vistoria;
  
  const defaultValues: Partial<VistoriaFormData> = vistoria ? {
    numero_controle: vistoria.numero_controle,
    placa: vistoria.placa,
    marca: vistoria.marca,
    modelo: vistoria.modelo,
    ano_fabricacao: vistoria.ano_fabricacao,
    ano_modelo: vistoria.ano_modelo,
    cor: vistoria.cor,
    municipio: vistoria.municipio,
    uf: vistoria.uf,
    observacoes: vistoria.observacoes,
  } : {
    ano_fabricacao: new Date().getFullYear(),
    ano_modelo: new Date().getFullYear(),
  };

  const photoSections = [
    { key: 'fotos_frente', label: 'Frente' },
    { key: 'fotos_lateral_esquerda', label: 'Lateral Esquerda' },
    { key: 'fotos_lateral_direita', label: 'Lateral Direita' },
    { key: 'fotos_traseira', label: 'Traseira' },
    { key: 'fotos_chassi', label: 'Chassi' },
    { key: 'fotos_motor', label: 'Motor' },
  ];

  return (
    <CRUDForm
      title={isEditing ? 'Editar Vistoria' : 'Nova Vistoria'}
      description={isEditing ? `Editando vistoria: ${vistoria.numero_controle}` : 'Preencha os dados da nova vistoria'}
      schema={vistoriaSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={isEditing ? 'Salvar Alterações' : 'Criar Vistoria'}
      cancelLabel="Cancelar"
    >
      {(form) => (
        <div className="space-y-6">
          {/* Dados básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero_controle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Controle *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2024001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ABC1D23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ano_fabricacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano de Fabricação *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 2023"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ano_modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano do Modelo *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 2024"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Branco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Município *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SP" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Observações adicionais sobre o veículo..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Upload de fotos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fotos do Veículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photoSections.map((section) => (
                <ImageUploadField
                  key={section.key}
                  label={section.label}
                  section={section.key}
                  images={images[section.key] || []}
                  maxImages={5}
                  onImagesChange={onImagesChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </CRUDForm>
  );
}

// Componente da lista de vistorias
interface VistoriaListProps {
  vistorias: Vistoria[];
  loading: boolean;
  onEdit: (vistoria: Vistoria) => void;
  onDelete: (id: string) => void;
}

function VistoriaList({ vistorias, loading, onEdit, onDelete }: VistoriaListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (vistorias.length === 0) {
    return (
      <EmptyState
        title="Nenhuma vistoria encontrada"
        description="Comece criando sua primeira vistoria"
        icon={<Car className="w-12 h-12" />}
        action={{
          label: "Criar primeira vistoria",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vistorias.map((vistoria) => (
        <Card key={vistoria.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{vistoria.numero_controle}</CardTitle>
              <Badge variant="outline">{vistoria.placa}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p><span className="font-medium">Marca:</span> {vistoria.marca}</p>
              <p><span className="font-medium">Modelo:</span> {vistoria.modelo}</p>
              <p><span className="font-medium">Ano:</span> {vistoria.ano_fabricacao}/{vistoria.ano_modelo}</p>
              <p><span className="font-medium">Cor:</span> {vistoria.cor}</p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                {new Date(vistoria.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(vistoria)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(vistoria.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}