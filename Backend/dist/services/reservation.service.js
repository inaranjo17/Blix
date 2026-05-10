"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = createReservation;
exports.getUserReservations = getUserReservations;
exports.cancelReservation = cancelReservation;
exports.getAllReservations = getAllReservations;
const db_1 = require("../configs/db");
const socket_1 = require("../configs/socket");
const generateCode_1 = require("../utils/generateCode");
const timeUtils_1 = require("../utils/timeUtils");
const email_service_1 = require("./email.service");
async function createReservation(userId, data) {
    const start = new Date(data.startTime);
    const end = new Date(start.getTime() + data.duration * 60000);
    const now = new Date();
    // No permitir reservas en el pasado
    if (start < now) {
        throw new Error('No puedes reservar en una hora pasada');
    }
    // Verificar que la mesa existe
    const table = await db_1.prisma.table.findUnique({ where: { id: data.tableId } });
    if (!table)
        throw new Error('Mesa no encontrada');
    if (table.state !== 'FREE' && table.state !== 'RESERVED') {
        throw new Error('La mesa no está disponible para reservar');
    }
    // Verificar conflictos de horario
    const existing = await db_1.prisma.reservation.findMany({
        where: {
            tableId: data.tableId,
            status: { in: ['PENDING', 'ACTIVE'] },
        },
    });
    for (const r of existing) {
        if ((0, timeUtils_1.hasTimeConflict)(start, end, r.startTime, r.endTime)) {
            // Buscar alternativas del mismo tamaño
            const alternatives = await db_1.prisma.table.findMany({
                where: {
                    capacity: table.capacity,
                    id: { not: data.tableId },
                    state: 'FREE',
                },
                include: {
                    reservations: {
                        where: { status: { in: ['PENDING', 'ACTIVE'] } },
                    },
                },
            });
            // Filtrar las que tampoco tienen conflicto
            const available = alternatives.filter((alt) => alt.reservations.every((ar) => !(0, timeUtils_1.hasTimeConflict)(start, end, ar.startTime, ar.endTime)));
            throw new Error(JSON.stringify({
                message: 'Horario ocupado para esta mesa',
                alternatives: available.map((a) => ({
                    id: a.id,
                    zone: a.zone,
                    capacity: a.capacity,
                })),
            }));
        }
    }
    // Crear reserva
    const code = (0, generateCode_1.generateReservationCode)(data.tableId);
    const reservation = await db_1.prisma.reservation.create({
        data: {
            code,
            userId,
            tableId: data.tableId,
            startTime: start,
            endTime: end,
            duration: data.duration,
        },
        include: {
            table: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                }
            }
        },
    });
    // Actualizar estado de mesa
    await db_1.prisma.table.update({
        where: { id: data.tableId },
        data: { state: 'RESERVED' },
    });
    // Emitir WebSocket a todos los clientes
    (0, socket_1.getIO)().emit('table:state_changed', {
        tableId: data.tableId,
        newState: 'RESERVED',
    });
    // Enviar correo de confirmación
    await (0, email_service_1.sendConfirmationEmail)(reservation.user.email, reservation.user.name, reservation.code, reservation.tableId, reservation.startTime, reservation.endTime);
    return reservation;
}
async function getUserReservations(userId) {
    return db_1.prisma.reservation.findMany({
        where: { userId },
        include: { table: true },
        orderBy: { createdAt: 'desc' },
    });
}
async function cancelReservation(reservationId, userId) {
    const reservation = await db_1.prisma.reservation.findUnique({
        where: { id: reservationId },
    });
    if (!reservation)
        throw new Error('Reserva no encontrada');
    if (reservation.userId !== userId)
        throw new Error('No es tu reserva');
    if (reservation.status === 'ACTIVE') {
        throw new Error('No puedes cancelar una reserva activa');
    }
    if (reservation.status === 'CANCELLED') {
        throw new Error('Esta reserva ya fue cancelada');
    }
    await db_1.prisma.reservation.update({
        where: { id: reservationId },
        data: { status: 'CANCELLED' },
    });
    // Verificar si hay otras reservas pendientes para esta mesa
    const otherPending = await db_1.prisma.reservation.findFirst({
        where: {
            tableId: reservation.tableId,
            status: { in: ['PENDING', 'ACTIVE'] },
        },
    });
    // Si no hay otras reservas, liberar la mesa
    if (!otherPending) {
        await db_1.prisma.table.update({
            where: { id: reservation.tableId },
            data: { state: 'FREE' },
        });
        (0, socket_1.getIO)().emit('table:state_changed', {
            tableId: reservation.tableId,
            newState: 'FREE',
        });
    }
}
async function getAllReservations() {
    return db_1.prisma.reservation.findMany({
        include: { user: { select: { id: true, name: true, email: true } }, table: true },
        orderBy: { createdAt: 'desc' },
    });
}
