import React from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

// Componente de Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

// Componente de Loading completo da página
interface PageLoadingProps {
  title?: string;
  description?: string;
}

export function PageLoading({ title = 'Carregando...', description }: PageLoadingProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Estado de carregamento em linha
interface InlineLoadingProps {
  text?: string;
  className?: string;
}

export function InlineLoading({ text = 'Carregando...', className }: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2 py-2', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// Estado de erro
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ 
  title = 'Ocorreu um erro',
  message,
  onRetry,
  retryLabel = 'Tentar novamente',
  className 
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className={cn('', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm opacity-90">{message}</div>
        </div>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetry}
            className="ml-4"
          >
            {retryLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Estado de sucesso
interface SuccessStateProps {
  title?: string;
  message: string;
  className?: string;
}

export function SuccessState({ 
  title = 'Sucesso!',
  message,
  className 
}: SuccessStateProps) {
  return (
    <Alert className={cn('border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200', className)}>
      <CheckCircle2 className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium">{title}</div>
        <div className="text-sm opacity-90">{message}</div>
      </AlertDescription>
    </Alert>
  );
}

// Estado vazio
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title = 'Nenhum item encontrado',
  description,
  action,
  icon,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('flex min-h-[200px] flex-col items-center justify-center text-center', className)}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Progress bar para uploads
interface UploadProgressProps {
  progress: number;
  message?: string;
  className?: string;
}

export function UploadProgress({ progress, message = 'Enviando...', className }: UploadProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{message}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Skeleton loading para cards
export function CardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loading para tabela
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
        </div>
      ))}
    </div>
  );
}