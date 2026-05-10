"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendReminderEmail = sendReminderEmail;
exports.sendTimerWarningEmail = sendTimerWarningEmail;
exports.sendNoShowEmail = sendNoShowEmail;
exports.sendConflictReassignedEmail = sendConflictReassignedEmail;
exports.sendExtensionApprovedEmail = sendExtensionApprovedEmail;
exports.sendExtensionRejectedEmail = sendExtensionRejectedEmail;
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const FROM = process.env.SENDGRID_FROM_EMAIL;
async function sendVerificationEmail(to, name, token) {
    const link = `${process.env.CLIENT_URL}/verify/${token}`;
    await mail_1.default.send({
        to,
        from: FROM,
        subject: 'BLIX — Verifica tu cuenta',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1e40af;">¡Hola ${name}! 👋</h2>
        <p>Gracias por registrarte en BLIX. Haz clic en el botón para verificar tu cuenta:</p>
        <a href="${link}" style="display:inline-block;background:#1e40af;color:white;
           padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Verificar cuenta
        </a>
        <p style="color:#666;font-size:14px;">Si no creaste esta cuenta, ignora este correo.</p>
      </div>`,
    });
}
async function sendConfirmationEmail(to, name, code, tableId, startTime, endTime) {
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — Reserva confirmada: Mesa ${tableId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1e40af;">¡Reserva confirmada! 🎉</h2>
        <p>Hola <strong>${name}</strong>, tu mesa está lista.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Mesa:</td>
              <td style="padding:8px;">${tableId}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Código:</td>
              <td style="padding:8px;font-family:monospace;font-size:18px;color:#1e40af;">${code}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Inicio:</td>
              <td style="padding:8px;">${startTime.toLocaleTimeString('es-CO')}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Fin:</td>
              <td style="padding:8px;">${endTime.toLocaleTimeString('es-CO')}</td></tr>
        </table>
        <p><strong>Al llegar:</strong> escanea el código QR en la mesa e ingresa tu código.</p>
        <p>Tienes <strong>10 minutos de gracia</strong> para hacer check-in.</p>
      </div>`,
    });
}
async function sendReminderEmail(to, name, code, tableId, minutesBefore) {
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — Tu reserva empieza en ${minutesBefore} minutos`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1e40af;">⏰ Recordatorio de reserva</h2>
        <p>Hola <strong>${name}</strong>, tu reserva de la Mesa <strong>${tableId}</strong>
           empieza en <strong>${minutesBefore} minutos</strong>.</p>
        <p>Código: <span style="font-family:monospace;font-size:18px;color:#1e40af;">${code}</span></p>
        <p>Al llegar escanea el QR en la mesa y confirma tu llegada.</p>
      </div>`,
    });
}
async function sendTimerWarningEmail(to, name, tableId, minutesLeft) {
    const extendMsg = minutesLeft === 10
        ? `<p>Si deseas extender, ingresa a la app → <strong>Mis reservas</strong>
         y toca el botón Extender.</p>`
        : `<p>Por favor comienza a liberar la mesa pronto.</p>`;
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — Te quedan ${minutesLeft} minutos en Mesa ${tableId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⏱️ Tiempo casi agotado</h2>
        <p>Hola <strong>${name}</strong>, tu tiempo en la Mesa <strong>${tableId}</strong>
           termina en <strong>${minutesLeft} minutos</strong>.</p>
        ${extendMsg}
      </div>`,
    });
}
async function sendNoShowEmail(to, name, tableId) {
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — Tu reserva de Mesa ${tableId} fue cancelada`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Reserva cancelada automáticamente</h2>
        <p>Hola <strong>${name}</strong>, tu reserva de la Mesa <strong>${tableId}</strong>
           fue cancelada porque no se detectó check-in dentro del tiempo de gracia
           (10 minutos).</p>
        <p>Puedes hacer una nueva reserva cuando quieras desde la app.</p>
      </div>`,
    });
}
async function sendConflictReassignedEmail(to, name, oldTable, newTable, newCode) {
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — Tu mesa fue reasignada → Mesa ${newTable}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #f97316;">⚠️ Tu mesa tenía un ocupante no autorizado</h2>
        <p>Hola <strong>${name}</strong>, detectamos que alguien estaba usando tu Mesa
           <strong>${oldTable}</strong> sin reserva válida.</p>
        <p>Te reasignamos la <strong>Mesa ${newTable}</strong>. Tu nuevo código es:</p>
        <p style="font-family:monospace;font-size:24px;color:#1e40af;font-weight:bold;">
          ${newCode}
        </p>
        <p>Dirígete a la Mesa ${newTable} y haz check-in con este código.</p>
      </div>`,
    });
}
async function sendExtensionApprovedEmail(to, name, tableId, newEndTime) {
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — Tu reserva fue extendida: Mesa ${tableId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #16a34a;">✅ Extensión aprobada</h2>
        <p>Hola <strong>${name}</strong>, tu tiempo en la Mesa <strong>${tableId}</strong>
           fue extendido.</p>
        <p>Nuevo tiempo de finalización: 
           <strong>${newEndTime.toLocaleTimeString('es-CO')}</strong></p>
      </div>`,
    });
}
async function sendExtensionRejectedEmail(to, name, tableId) {
    await mail_1.default.send({
        to,
        from: FROM,
        subject: `BLIX — No fue posible extender tu reserva: Mesa ${tableId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #dc2626;">❌ Extensión no disponible</h2>
        <p>Hola <strong>${name}</strong>, no fue posible extender tu tiempo en la Mesa
           <strong>${tableId}</strong> porque hay otra reserva a continuación.</p>
        <p>Por favor libera la mesa al terminar tu tiempo. ¡Gracias!</p>
      </div>`,
    });
}
