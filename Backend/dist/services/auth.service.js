"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.verifyEmail = verifyEmail;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../configs/db");
const generateToken_1 = require("../utils/generateToken");
async function registerUser(data) {
    const existing = await db_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existing)
        throw new Error('Email ya registrado');
    const passwordHash = await bcrypt_1.default.hash(data.password, 12);
    const verifyToken = (0, generateToken_1.generateVerifyToken)();
    const user = await db_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            passwordHash,
            verifyToken,
        },
    });
    return { user, verifyToken };
}
async function loginUser(email, password) {
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('Credenciales inválidas');
    if (!user.verified)
        throw new Error('Verifica tu email antes de ingresar');
    const valid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!valid)
        throw new Error('Credenciales inválidas');
    const token = (0, generateToken_1.generateJWT)(user.id, user.role);
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}
async function verifyEmail(token) {
    const user = await db_1.prisma.user.findUnique({
        where: { verifyToken: token },
    });
    // Si no encuentra el token, verificar si hay un usuario
    // que ya fue verificado previamente con ese proceso
    // (segunda llamada de StrictMode o doble clic en el link)
    if (!user) {
        // El token ya fue consumido — considerar esto éxito silencioso
        // para no romper la experiencia del usuario
        throw new Error('TOKEN_ALREADY_USED');
    }
    // Si ya estaba verificado de alguna forma, retornar éxito igual
    if (user.verified) {
        return user;
    }
    await db_1.prisma.user.update({
        where: { id: user.id },
        data: { verified: true, verifyToken: null },
    });
    return user;
}
