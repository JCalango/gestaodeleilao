
-- Adicionar campo motor_alterado se não existir
ALTER TABLE vistorias ADD COLUMN IF NOT EXISTS motor_alterado VARCHAR(10);

-- Atualizar valores nulos para uma opção padrão
UPDATE vistorias SET motor_alterado = 'nao' WHERE motor_alterado IS NULL;
