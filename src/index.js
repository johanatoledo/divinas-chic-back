import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import pedidosRoutes from "./routes/pedidos.routes.js";
import { db } from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 4002;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";




// ==========================================
// CONFIGURACIÓN DE ORIGINS PERMITIDOS
// ==========================================
const allowedOrigins = [
  "http://localhost:3000",
  "https://divinaschic1.tonav-tech.online",
  process.env.FRONTEND_URL,
].filter(Boolean);
// ==========================================
// CONFIGURACIÓN DE CORS 
// ==========================================
const corsOptions = {
  origin: function(origin, callback) {
    
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }else{
         callback(new Error(`CORS bloqueado para origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Bypass-Tunnel-Reminder'
  ],
  exposedHeaders: ['Content-Length', 'X-JSON-Response'],
  maxAge: 86400 
};

// Aplicar CORS globalmente
app.use(cors(corsOptions));


app.use(express.json());

// ==========================================
// Verificacion de funcionamiento de rutas 
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "API DivinasChic1 funcionando correctamente",
  });
});


// ==========================================
// Verificacion de conexion con base de datos
// ==========================================

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// ==========================================
// DEFINICIÓN DE ENDPOINTS
// ==========================================
app.use("/api/pedidos", pedidosRoutes);


// ==========================================
// Manejo de errores 
// ==========================================
 // Error de rutas
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

 // Error de CORS
app.use((err, req, res, next) => {
 
  if (err.message === 'CORS no permitido') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'El origen de tu request no está permitido'
    });
  }
  
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});


// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT,"0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);
  

});