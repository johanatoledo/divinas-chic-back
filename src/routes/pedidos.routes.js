import { Router } from "express";
import {
  asignarUbicacionPedido,
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

router.patch("/:id/ubicacion", asignarUbicacionPedido);

router.patch("/:id/entregar", marcarPedidoEntregado);

export default router;