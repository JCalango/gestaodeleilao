
-- Inserir configuração para o presidente da comissão de leilão
INSERT INTO public.system_settings (setting_key, setting_value) 
VALUES ('presidente_comissao_leilao', 'Nome do Presidente')
ON CONFLICT (setting_key) DO NOTHING;
