import React, { useState } from 'react';
import { useForm, FormProvider, FieldValues, Path, UseFormReturn, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { LoadingSpinner, ErrorState, SuccessState } from '@/components/ui/loading-states';
import { cn } from '@/lib/utils';

export interface CRUDFormProps<T extends FieldValues> {
  // Configuração do formulário
  title: string;
  description?: string;
  schema: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  
  // Ações
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  
  // Estado
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
  
  // Customização
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  
  // Renderização do conteúdo
  children: (form: UseFormReturn<T>) => React.ReactNode;
  
  // Ações adicionais
  actions?: React.ReactNode;
}

export function CRUDForm<T extends FieldValues>({
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  success = null,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  className,
  children,
  actions
}: CRUDFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-6">
              {/* Estado de carregamento inicial */}
              {isLoading && (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" text="Carregando dados..." />
                </div>
              )}

              {/* Estado de erro */}
              {error && (
                <ErrorState
                  message={error}
                  onRetry={() => window.location.reload()}
                />
              )}

              {/* Estado de sucesso */}
              {success && (
                <SuccessState message={success} />
              )}

              {/* Conteúdo do formulário */}
              {!isLoading && (
                <div className="space-y-4">
                  {children(form)}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="flex gap-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    {cancelLabel}
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading || !form.formState.isValid}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" text={submitLabel} />
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>

              {/* Ações adicionais */}
              {actions && (
                <div className="flex gap-2">
                  {actions}
                </div>
              )}
            </CardFooter>
          </form>
        </Form>
      </FormProvider>
    </Card>
  );
}

// Hook auxiliar para validação em tempo real
export function useFormValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  field: Path<T>
) {
  const fieldState = form.getFieldState(field);
  const fieldValue = form.watch(field);

  return {
    error: fieldState.error?.message,
    isValid: !fieldState.error && fieldValue !== undefined && fieldValue !== '',
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
  };
}