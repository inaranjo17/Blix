"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTables = getAllTables;
exports.getTableById = getTableById;
exports.updateTableState = updateTableState;
const db_1 = require("../configs/db");
async function getAllTables() {
    return db_1.prisma.table.findMany({
        orderBy: [{ zone: 'asc' }, { id: 'asc' }],
        include: {
            reservations: {
                where: { status: { in: ['PENDING', 'ACTIVE'] } },
                select: {
                    id: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                },
            },
        },
    });
}
async function getTableById(id) {
    return db_1.prisma.table.findUnique({
        where: { id },
        include: {
            reservations: {
                where: { status: { in: ['PENDING', 'ACTIVE'] } },
                select: {
                    id: true,
                    code: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                },
            },
        },
    });
}
async function updateTableState(id, state, extra) {
    return db_1.prisma.table.update({
        where: { id },
        data: { state, ...extra },
    });
}
