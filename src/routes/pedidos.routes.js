import { Router } from "express";
import {
  confirmarPagoPedido,
  crearPedido,
  marcarPedidoEntregado,
  obtenerPedidoPorId,
  obtenerPedidos,
} from "../controllers/pedidosController.js";

const router = Router();

router.get("/", obtenerPedidos);

router.post("/", crearPedido);

router.get("/:id", obtenerPedidoPorId);

router.patch("/:id/pago", confirmarPagoPedido);

router.patch("/:id/entregar", marcarPedidoEntregado);

export default router;