"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verify = verify;
exports.me = me;
const authService = __importStar(require("../services/auth.service"));
const email_service_1 = require("../services/email.service");
const db_1 = require("../configs/db");
async function register(req, res) {
    try {
        const { user, verifyToken } = await authService.registerUser(req.body);
        await (0, email_service_1.sendVerificationEmail)(user.email, user.name, verifyToken);
        res.status(201).json({
            message: '¡Registrado! Revisa tu correo para verificar tu cuenta.',
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al registrar';
        res.status(400).json({ error: message });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.json(result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
        res.status(401).json({ error: message });
    }
}
async function verify(req, res) {
    try {
        const token = req.params.token;
        await authService.verifyEmail(token);
        res.json({ message: '¡Email verificado! Ya puedes iniciar sesión.' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error de verificación';
        // TOKEN_ALREADY_USED significa que el link ya fue usado exitosamente antes
        // Devolver 200 en lugar de 400 — desde la perspectiva del usuario, su cuenta SÍ está verificada
        if (message === 'TOKEN_ALREADY_USED') {
            res.json({ message: '¡Email verificado! Ya puedes iniciar sesión.' });
            return;
        }
        res.status(400).json({ error: message });
    }
}
async function me(req, res) {
    try {
        const authReq = req; // ← fix línea 43
        const user = await db_1.prisma.user.findUnique({
            where: { id: authReq.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            },
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}
