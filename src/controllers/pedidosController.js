import {
  actualizarPedidosListosModel,
  asignarUbicacionPedidoModel,
  confirmarPagoPedidoModel,
  crearPedidoModel,
  marcarPedidoEntregadoModel,
  obtenerPedidoPorIdModel,
  obtenerPedidosModel,
} from "../models/pedidoModel.js";

export async function crearPedido(req, res) {
  try {
    const {
      cliente_nombre,
      tipo_pedido,
      productos,
      total,
      yape_operacion,
    } = req.body;

    if (!cliente_nombre || cliente_nombre.trim() === "") {
      return res.status(400).json({
        message: "El nombre del cliente es obligatorio",
      });
    }

    if (!tipo_pedido) {
      return res.status(400).json({
        message: "Debe indicar si el pedido es para llevar o para consumir en el restaurante",
      });
    }

    if (
      tipo_pedido !== "restaurante" &&
      tipo_pedido !== "llevar"
    ) {
      return res.status(400).json({
        message: "Tipo de pedido no válido",
      });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        message: "Debe agregar al menos un producto",
      });
    }

    if (!total || Number(total) <= 0) {
      return res.status(400).json({
        message: "El total del pedido no es válido",
      });
    }

    if (!yape_operacion || yape_operacion.trim() === "") {
      return res.status(400).json({
        message: "El ID de operación Yape es obligatorio",
      });
    }

    const pedidoId = await crearPedidoModel({
      cliente_nombre,
      tipo_pedido,
      productos,
      total,
      yape_operacion,
});

    return res.status(201).json({
      message: "Pedido creado correctamente",
      pedidoId,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);

    return res.status(500).json({
      message: "Error interno al crear el pedido",
    });
  }
}

export async function obtenerPedidos(req, res) {
  try {
    await actualizarPedidosListosModel();

    const pedidos = await obtenerPedidosModel();

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    return res.status(500).json({
      message: "Error interno al obtener pedidos",
    });
  }
}

export async function obtenerPedidoPorId(req, res) {
  try {
    const { id } = req.params;

    await actualizarPedidosListosModel();

    const pedido = await obtenerPedidoPorIdModel(id);

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error("Error al obtener pedido:", error);

    return res.status(500).json({
      message: "Error al obtener el pedido",
    });
  }
}

export async function confirmarPagoPedido(req, res) {
  try {
    const { id } = req.params;

    const pedidoActualizado =
      await confirmarPagoPedidoModel(id);

    if (!pedidoActualizado) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    return res.status(200).json({
      message: "Pago verificado correctamente",
      pedidoId: Number(id),
      pago_verificado: Boolean(
        pedidoActualizado.pago_verificado
      ),
      pago_confirmado_en:
        pedidoActualizado.pago_confirmado_en,
      estado: pedidoActualizado.estado,
    });
  } catch (error) {
    console.error("Error al confirmar pago:", error);

    return res.status(500).json({
      message: "Error interno al confirmar el pago",
    });
  }
}
export async function asignarUbicacionPedido(req, res) {
  try {
    const { id } = req.params;
    const { ubicacion } = req.body;

    if (!ubicacion || ubicacion.trim() === "") {
      return res.status(400).json({
        message: "La ubicación o mesa es obligatoria",
      });
    }

    const ubicacionLimpia = ubicacion.trim();

    const affectedRows = await asignarUbicacionPedidoModel(
      id,
      ubicacionLimpia
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    return res.status(200).json({
      message: "Ubicación asignada correctamente",
      pedidoId: Number(id),
      ubicacion: ubicacionLimpia,
    });
  } catch (error) {
    console.error("Error al asignar ubicación:", error);

    return res.status(500).json({
      message: "Error interno al asignar ubicación",
    });
  }
}


export async function marcarPedidoEntregado(req, res) {
  try {
    const { id } = req.params;

    const affectedRows = await marcarPedidoEntregadoModel(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    return res.status(200).json({
      message: "Pedido marcado como entregado",
      pedidoId: Number(id),
    });
  } catch (error) {
    console.error("Error al marcar pedido como entregado:", error);

    return res.status(500).json({
      message: "Error interno al actualizar pedido",
    });
  }
}