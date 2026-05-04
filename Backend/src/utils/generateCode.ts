export function generateReservationCode(tableId: string): string {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `BLIX-${tableId}-${random}`
}