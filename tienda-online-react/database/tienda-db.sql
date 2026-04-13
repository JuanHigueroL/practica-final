CREATE DATABASE IF NOT EXISTS `tienda-db`;
USE `tienda-db`;

DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE categorias(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
    );
    
CREATE TABLE productos (
	id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_unico VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id));

CREATE TABLE imagenes_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
    
CREATE TABLE roles (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
    );
    
INSERT INTO roles (nombre) VALUES ('Admin');    -- Se creará con ID 1
INSERT INTO roles (nombre) VALUES ('Usuario');  -- Se creará con ID 2

SELECT * FROM roles;
    
CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(15) NOT NULL UNIQUE,
    correo VARCHAR (50) NOT NULL UNIQUE,
    contrasena VARCHAR(50) NOT NULL,
    rol_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id));
