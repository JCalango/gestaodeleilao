import React from 'react';
import { z } from 'zod';
import { CRUDForm } from '@/components/forms/CRUDForm';
import { useVistoriaCRUD, VistoriaData } from '@/hooks/useVistoriaCRUD';
import { useImageManagement } from '@/hooks/useImageManagement';
import { ImageUploadField } from '@/components/forms/ImageUploadField';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

// Schema de validação
const vistoriaSchema = z.object({
  numero_controle: z.string().min(1, 'Número de controle é obrigatório'),
  placa: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano_fabricacao: z.number().optional(),
  ano_modelo: z.number().optional(),
  cor: z.string().optional(),
  observacoes: z.string().optional(),
});

type VistoriaFormData = z.infer<typeof vistoriaSchema>;

export function VistoriaCRUDExample() {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  // Hook CRUD para vistorias
  const vistoriaCRUD = useVistoriaCRUD();

  // Hook para gerenciar imagens
  const imageManager = useImageManagement(
    { bucketName: 'vistoria-fotos' },
    (images) => {
      console.log('Images updated:', images);
    }
  );

  const handleSubmit = async (data: VistoriaFormData) => {
    try {
      // Criar dados com as imagens
      const vistoriaData: Partial<VistoriaData> = {
        ...data,
        fotos_frente: imageManager.state.images.frente || [],
        fotos_lateral_esquerda: imageManager.state.images.lateral_esquerda || [],
        fotos_lateral_direita: imageManager.state.images.lateral_direita || [],
        fotos_traseira: imageManager.state.images.traseira || [],
        fotos_chassi: imageManager.state.images.chassi || [],
        fotos_motor: imageManager.state.images.motor || [],
      };

      if (editingId) {
        await vistoriaCRUD.updateVistoria(editingId, vistoriaData);
        setEditingId(null);
      } else {
        await vistoriaCRUD.createVistoria(vistoriaData);
      }

      // Limpar formulário
      setShowForm(false);
      imageManager.operations.setImages({});
    } catch (error) {
      console.error('Error submitting vistoria:', error);
    }
  };

  const handleEdit = (vistoria: VistoriaData) => {
    setEditingId(vistoria.id!);
    setShowForm(true);
    
    // Carregar imagens existentes
    const existingImages = {
      frente: vistoria.fotos_frente || [],
      lateral_esquerda: vistoria.fotos_lateral_esquerda || [],
      lateral_direita: vistoria.fotos_lateral_direita || [],
      traseira: vistoria.fotos_traseira || [],
      chassi: vistoria.fotos_chassi || [],
      motor: vistoria.fotos_motor || [],
    };
    imageManager.operations.setImages(existingImages);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vistoria?')) {
      await vistoriaCRUD.deleteVistoria(id);
    }
  };

  const editingVistoria = editingId ? vistoriaCRUD.vistorias.find(v => v.id === editingId) : null;
  const defaultValues = editingVistoria ? {
    numero_controle: editingVistoria.numero_controle,
    placa: editingVistoria.placa || '',
    marca: editingVistoria.marca || '',
    modelo: editingVistoria.modelo || '',
    ano_fabricacao: editingVistoria.ano_fabricacao || undefined,
    ano_modelo: editingVistoria.ano_modelo || undefined,
    cor: editingVistoria.cor || '',
    observacoes: editingVistoria.observacoes || '',
  } : {
    numero_controle: '',
    placa: '',
    marca: '',
    modelo: '',
    observacoes: '',
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Vistorias</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nova Vistoria'}
        </Button>
      </div>

      {showForm && (
        <CRUDForm
          title={editingId ? 'Editar Vistoria' : 'Nova Vistoria'}
          schema={vistoriaSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
            imageManager.operations.setImages({});
          }}
          isLoading={vistoriaCRUD.actionLoading}
          error={vistoriaCRUD.error}
        >
          {(form) => (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numero_controle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Controle *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: CTRL-2024-001" />
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
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: ABC-1234" />
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
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Toyota" />
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
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Corolla" />
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
                      <FormLabel>Ano de Fabricação</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="Ex: 2020"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Branco" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload de Imagens */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fotos do Veículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploadField
                    label="Frente"
                    section="frente"
                    imageManager={imageManager}
                  />
                  <ImageUploadField
                    label="Lateral Esquerda"
                    section="lateral_esquerda"
                    imageManager={imageManager}
                  />
                  <ImageUploadField
                    label="Lateral Direita"
                    section="lateral_direita"
                    imageManager={imageManager}
                  />
                  <ImageUploadField
                    label="Traseira"
                    section="traseira"
                    imageManager={imageManager}
                  />
                  <ImageUploadField
                    label="Chassi"
                    section="chassi"
                    imageManager={imageManager}
                  />
                  <ImageUploadField
                    label="Motor"
                    section="motor"
                    imageManager={imageManager}
                  />
                </div>
              </div>

              {/* Observações */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Observações adicionais..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CRUDForm>
      )}

      {/* Lista de Vistorias */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Vistorias Cadastradas</h2>
        
        {vistoriaCRUD.loading ? (
          <div className="text-center py-8">Carregando vistorias...</div>
        ) : vistoriaCRUD.error ? (
          <div className="text-center py-8 text-destructive">
            Erro ao carregar vistorias: {vistoriaCRUD.error}
          </div>
        ) : vistoriaCRUD.vistorias.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma vistoria cadastrada
          </div>
        ) : (
          <div className="grid gap-4">
            {vistoriaCRUD.vistorias.map((vistoria) => (
              <Card key={vistoria.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {vistoria.numero_controle}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vistoria)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(vistoria.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <strong>Placa:</strong> {vistoria.placa || 'N/A'}
                    </div>
                    <div>
                      <strong>Marca:</strong> {vistoria.marca || 'N/A'}
                    </div>
                    <div>
                      <strong>Modelo:</strong> {vistoria.modelo || 'N/A'}
                    </div>
                  </div>

                  {vistoria.observacoes && (
                    <div className="mt-4">
                      <strong>Observações:</strong>
                      <p className="text-muted-foreground mt-1">{vistoria.observacoes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}