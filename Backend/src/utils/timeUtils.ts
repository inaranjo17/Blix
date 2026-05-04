export function hasTimeConflict(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean {
  return newStart < existingEnd && newEnd > existingStart
}

export function minutesRemaining(endTime: Date): number {
  return Math.floor((endTime.getTime() - Date.now()) / 60000)
}