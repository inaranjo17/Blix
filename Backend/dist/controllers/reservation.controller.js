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
exports.createReservation = createReservation;
exports.getMyReservations = getMyReservations;
exports.cancelReservation = cancelReservation;
exports.getAllReservations = getAllReservations;
const reservationService = __importStar(require("../services/reservation.service"));
async function createReservation(req, res) {
    try {
        const reservation = await reservationService.createReservation(req.user.userId, req.body);
        res.status(201).json(reservation);
    }
    catch (err) {
        if (err instanceof Error) {
            // Intentar parsear si viene con alternativas
            try {
                const parsed = JSON.parse(err.message);
                res.status(409).json(parsed);
                return;
            }
            catch {
                // No era JSON, es un mensaje simple
            }
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(500).json({ error: 'Error al crear reserva' });
    }
}
async function getMyReservations(req, res) {
    try {
        const reservations = await reservationService.getUserReservations(req.user.userId);
        res.json(reservations);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al obtener reservas';
        res.status(500).json({ error: message });
    }
}
async function cancelReservation(req, res) {
    try {
        await reservationService.cancelReservation(req.params.id, req.user.userId);
        res.json({ message: 'Reserva cancelada exitosamente' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cancelar';
        res.status(400).json({ error: message });
    }
}
async function getAllReservations(_req, res) {
    try {
        const reservations = await reservationService.getAllReservations();
        res.json(reservations);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Error al obtener reservas';
        res.status(500).json({ error: message });
    }
}
