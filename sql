CREATE DATABASE IF NOT EXISTS cafe_express;

USE cafe_express;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre VARCHAR(100) NOT NULL,
  productos JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  yape_operacion VARCHAR(100) NOT NULL,
  estado ENUM('preparando', 'listo', 'entregado') DEFAULT 'preparando',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);