"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_1 = require("./configs/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Inicializa Socket.io (debe ser antes de las rutas)
const io = (0, socket_1.initSocket)(httpServer);
// Middlewares globales
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL }));
app.use(express_1.default.json());
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});
// ── Rutas ──────────────────────────────────────────
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const table_routes_1 = __importDefault(require("./routes/table.routes"));
const reservation_routes_1 = __importDefault(require("./routes/reservation.routes"));
const checkin_routes_1 = __importDefault(require("./routes/checkin.routes"));
const extension_routes_1 = __importDefault(require("./routes/extension.routes"));
const sensor_routes_1 = __importDefault(require("./routes/sensor.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/tables', table_routes_1.default);
app.use('/api/reservations', reservation_routes_1.default);
app.use('/api/checkin', checkin_routes_1.default);
app.use('/api/reservations', extension_routes_1.default); // /api/reservations/:id/extend
app.use('/api/sensor', sensor_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// ── Jobs y broadcasts automáticos ──────────────────────
const stateEngine_1 = require("./jobs/stateEngine");
const emailReminders_1 = require("./jobs/emailReminders");
const tableEvents_1 = require("./sockets/tableEvents");
// WebSocket eventos
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);
    // Admin se une a su sala privada
    socket.on('admin:join', () => {
        socket.join('admin-room');
        console.log(`👑 Admin unido a sala: ${socket.id}`);
    });
    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
});
// Arrancar servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor BLIX en http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    // Arrancar procesos automáticos DESPUÉS de que el servidor inicia
    (0, stateEngine_1.startStateEngine)();
    (0, emailReminders_1.startEmailReminders)();
    (0, tableEvents_1.startTimerBroadcast)();
});
