-- =====================================================
--  Granada Eventos — Esquema de base de datos
--  Ejecutar en MySQL Workbench o línea de comandos:
--  mysql -u root -p < schema.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS granada_eventos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE granada_eventos;

CREATE TABLE IF NOT EXISTS eventos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(255)  NOT NULL,
  zona        VARCHAR(100)  NOT NULL,
  fecha       DATE          NOT NULL,
  hora        VARCHAR(10)   NOT NULL,
  precio      VARCHAR(100),
  ubicacion   VARCHAR(255),
  descripcion TEXT,
  categoria   VARCHAR(100),
  aforo       VARCHAR(100),
  organizador VARCHAR(255),
  imagen      VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bares (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(255)  NOT NULL,
  zona        VARCHAR(100)  NOT NULL,
  descripcion TEXT,
  direccion   VARCHAR(255),
  horarios    VARCHAR(255),
  telefono    VARCHAR(50),
  imagen      VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  nombre      VARCHAR(100)  NOT NULL,
  avatar_url  VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comentarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  evento_id   INT           NOT NULL,
  autor       VARCHAR(100)  NOT NULL DEFAULT 'Visitante',
  texto       TEXT          NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS valoraciones (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  evento_id   INT           NOT NULL,
  puntuacion  TINYINT       NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
) ENGINE=InnoDB;
