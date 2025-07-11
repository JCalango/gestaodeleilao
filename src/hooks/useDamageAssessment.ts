
import { useState } from 'react';
import { VehicleDamageAssessment, SimpleDamageAssessment, VehicleType } from '@/types/damage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDamageAssessment = () => {
  const [assessments, setAssessments] = useState<SimpleDamageAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createAssessment = async (assessment: Omit<SimpleDamageAssessment, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const newAssessment: SimpleDamageAssessment = {
        ...assessment,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in localStorage for now
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      existingAssessments.push(newAssessment);
      localStorage.setItem('damageAssessments', JSON.stringify(existingAssessments));

      setAssessments(prev => [...prev, newAssessment]);
      
      toast({
        title: "Sucesso",
        description: "Avaliação de danos criada com sucesso!",
      });

      return newAssessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar avaliação de danos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssessment = async (id: string, updates: Partial<SimpleDamageAssessment>) => {
    setIsLoading(true);
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      const updatedAssessments = existingAssessments.map((assessment: SimpleDamageAssessment) =>
        assessment.id === id 
          ? { ...assessment, ...updates, updated_at: new Date().toISOString() }
          : assessment
      );
      
      localStorage.setItem('damageAssessments', JSON.stringify(updatedAssessments));
      setAssessments(updatedAssessments);
      
      toast({
        title: "Sucesso",
        description: "Avaliação de danos atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar avaliação de danos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAssessment = async (id: string) => {
    setIsLoading(true);
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      const filteredAssessments = existingAssessments.filter((assessment: SimpleDamageAssessment) => assessment.id !== id);
      
      localStorage.setItem('damageAssessments', JSON.stringify(filteredAssessments));
      setAssessments(filteredAssessments);
      
      toast({
        title: "Sucesso",
        description: "Avaliação de danos removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover avaliação de danos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssessments = () => {
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      setAssessments(existingAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
      setAssessments([]);
    }
  };

  return {
    assessments,
    isLoading,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    loadAssessments,
  };
};
