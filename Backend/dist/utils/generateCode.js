"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReservationCode = generateReservationCode;
function generateReservationCode(tableId) {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BLIX-${tableId}-${random}`;
}
