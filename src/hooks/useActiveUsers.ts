
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ActiveUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
  lastActivity?: string;
  isOnline?: boolean;
}

interface UserActivity {
  user_id: string;
  activity_type: string;
  created_at: string;
}

export const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveUsers = async () => {
    try {
      setIsLoading(true);

      // Buscar todos os perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários",
          variant: "destructive",
        });
        return;
      }

      // Buscar atividades recentes dos usuários (últimas 24 horas)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('user_id, activity_type, created_at')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: false });

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        // Não mostra erro para atividades, pois é opcional
      }

      // Combinar perfis com atividades
      const usersWithActivity = profiles?.map(profile => {
        const userActivities = activities?.filter(activity => activity.user_id === profile.id) || [];
        const lastActivity = userActivities.length > 0 ? userActivities[0].created_at : null;
        
        // Considera usuário online se teve atividade nas últimas 2 horas
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
        const isOnline = lastActivity ? new Date(lastActivity) > twoHoursAgo : false;

        return {
          ...profile,
          lastActivity: lastActivity || undefined,
          isOnline
        };
      }) || [];

      setActiveUsers(usersWithActivity);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários ativos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logUserActivity = async (activityType: string, description?: string) => {
    try {
      const { error } = await supabase.rpc('log_user_activity', {
        p_activity_type: activityType,
        p_description: description || null,
        p_metadata: null
      });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  return {
    activeUsers,
    isLoading,
    refreshActiveUsers: fetchActiveUsers,
    logUserActivity
  };
};
