CREATE DATABASE IF NOT EXISTS divinas_chic;

USE divinas_chic;

CREATE TABLE pedidos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 cliente_nombre VARCHAR(100) NOT NULL,
 tipo_pedido ENUM (‘estacion’,’delivery’) NOT NULL DEFAULT ‘estacion’,
 productos JSON NOT NULL,
 total DECIMAL(10,2) NOT NULL,
 yape_operacion VARCHAR(100) NOT NULL,
 pago_verificado TINYINT(1) NOT NULL DEFAULT ‘0’,
 pago_confirmado_en DATETIME DEFAULT NULL,
 estado ENUM(‘pendiente_pago’,'preparando', 'listo', 'entregado') NOT NULL     DEFAULT 'pendiente_pago',
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
