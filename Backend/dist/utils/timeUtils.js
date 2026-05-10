"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTimeConflict = hasTimeConflict;
exports.minutesRemaining = minutesRemaining;
function hasTimeConflict(newStart, newEnd, existingStart, existingEnd) {
    return newStart < existingEnd && newEnd > existingStart;
}
function minutesRemaining(endTime) {
    return Math.floor((endTime.getTime() - Date.now()) / 60000);
}
