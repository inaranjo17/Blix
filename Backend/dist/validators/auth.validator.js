"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nombre muy corto'),
    email: zod_1.z.string().email('Email inválido'),
    phone: zod_1.z.string().min(7, 'Teléfono muy corto'),
    password: zod_1.z.string().min(6, 'Mínimo 6 caracteres'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
