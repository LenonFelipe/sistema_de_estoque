CREATE DATABASE IF NOT EXISTS estoque_confeitaria
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE estoque_confeitaria;

CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    unidade_medida VARCHAR(20) NOT NULL,
    estoque_minimo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    insumo_id INT NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA', 'PERDA', 'AJUSTE') NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimentacao_insumo
        FOREIGN KEY (insumo_id)
        REFERENCES insumos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);