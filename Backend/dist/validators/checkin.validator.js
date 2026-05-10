"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkinSchema = void 0;
const zod_1 = require("zod");
exports.checkinSchema = zod_1.z.object({
    tableId: zod_1.z.string().min(2, 'Mesa requerida'),
    code: zod_1.z.string().min(8, 'Código inválido'),
});
