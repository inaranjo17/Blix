"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservationSchema = void 0;
const zod_1 = require("zod");
exports.createReservationSchema = zod_1.z.object({
    tableId: zod_1.z.string().min(2, 'Mesa requerida'),
    startTime: zod_1.z.string().datetime({ message: 'Fecha/hora inválida' }),
    duration: zod_1.z.union([zod_1.z.literal(30), zod_1.z.literal(45), zod_1.z.literal(60)], { error: 'Duración debe ser 30, 45 o 60 minutos' }),
});
