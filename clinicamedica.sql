CREATE DATABASE clinicamedica;
USE clinicamedica;

-- Criar a tabela
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    celular TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

