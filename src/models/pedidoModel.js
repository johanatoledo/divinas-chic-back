import { db } from "../config/db.js";

export async function crearPedidoModel({
  cliente_nombre,
  tipo_pedido,
  productos,
  total,
  yape_operacion,
}) {
  const [result] = await db.query(
    `
    INSERT INTO pedidos (
      cliente_nombre,
      tipo_pedido,
      productos,
      total,
      yape_operacion,
      pago_verificado,
      pago_confirmado_en,
      estado
    )
    VALUES (?, ?, ?, ?, ?, FALSE, NULL, ?)
    `,
    [
      cliente_nombre,
      tipo_pedido,
      JSON.stringify(productos),
      total,
      yape_operacion,
      "pendiente_pago",
    ]
  );

  return result.insertId;
}

export async function obtenerPedidosModel() {
  const [rows] = await db.query(
    `
    SELECT
  id,
  cliente_nombre,
  tipo_pedido,
  productos,
  total,
  yape_operacion,
  pago_verificado,
  pago_confirmado_en,
  estado,
  creado_en,
  actualizado_en
   FROM pedidos
   WHERE estado != 'entregado'
   ORDER BY creado_en ASC;
    `
  );

  return rows;
}

export async function obtenerPedidoPorIdModel(id) {
  const [rows] = await db.query(
    `
    SELECT
  id,
  cliente_nombre,
  tipo_pedido,
  productos,
  total,
  yape_operacion,
  pago_verificado,
  pago_confirmado_en,
  estado,
  creado_en,
  actualizado_en
  FROM pedidos
   WHERE id = ?
   LIMIT 1;
    `,
    [id]
  );

  return rows[0];
}

export async function confirmarPagoPedidoModel(id) {
  await db.query(
    `
    UPDATE pedidos
    SET
      pago_verificado = TRUE,
      pago_confirmado_en = COALESCE(pago_confirmado_en, NOW()),
      estado = CASE
        WHEN estado = 'pendiente_pago' THEN 'preparando'
        ELSE estado
      END
    WHERE id = ?
    `,
    [id]
  );

  const [rows] = await db.query(
    `
    SELECT
      id,
      pago_verificado,
      pago_confirmado_en,
      estado
    FROM pedidos
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}


export async function marcarPedidoEntregadoModel(id) {
  const [result] = await db.query(
    `
    UPDATE pedidos
    SET estado = 'entregado'
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
}

export async function actualizarPedidosListosModel() {
  const [result] = await db.query(
    `
    UPDATE pedidos
    SET estado = 'listo'
    WHERE estado = 'preparando'
      AND pago_verificado = TRUE
      AND pago_confirmado_en IS NOT NULL
      AND TIMESTAMPDIFF(
        SECOND,
        pago_confirmado_en,
        NOW()
      ) >= 1200
    `
  );

  return result.affectedRows;
}