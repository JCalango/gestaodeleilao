
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
}

// Cliente Supabase tipado
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
	},
	global: {
		headers: {
			'X-Client-Info': 'vistoria-app',
		},
	},
});

// Hook para obter URLs públicas das fotos
export const getPhotoPublicUrl = (path: string, bucket = 'vistoria-fotos'): string => {
	if (!path) return '';
	try {
		const { data } = supabase.storage.from(bucket).getPublicUrl(path);
		return data.publicUrl;
	} catch (error) {
		console.error('Erro ao obter URL pública:', error);
		return '';
	}
};

// Hook para upload de fotos
export const uploadPhoto = async (
	file: File, 
	path: string, 
	bucket = 'vistoria-fotos'
): Promise<{ data: any; error: any }> => {
	try {
		const fileExt = file.name.split('.').pop();
		const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
		const filePath = `${path}/${fileName}`;

		const { data, error } = await supabase.storage
			.from(bucket)
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: false
			});

		if (error) throw error;

		return { data: { ...data, fullPath: filePath }, error: null };
	} catch (error) {
		console.error('Erro no upload:', error);
		return { data: null, error };
	}
};

// Hook para deletar foto
export const deletePhoto = async (
	path: string, 
	bucket = 'vistoria-fotos'
): Promise<{ error: any }> => {
	try {
		const { error } = await supabase.storage
			.from(bucket)
			.remove([path]);

		return { error };
	} catch (error) {
		console.error('Erro ao deletar foto:', error);
		return { error };
	}
};

export default supabase;
