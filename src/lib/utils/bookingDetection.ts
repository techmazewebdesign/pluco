/**
 * Detect if user message is about booking/consultation
 * SIMPLE AND RELIABLE: Check for booking keywords
 */
export function isBookingIntent(message: string): boolean {
  if (!message) return false;

  const lowerMessage = message.toLowerCase().trim();

  // BOOKING KEYWORDS - must match AT LEAST ONE
  const bookingKeywords = [
    'book',
    'booking',
    'consultation',
    'consult',
    'schedule',
    'appointment',
    'call',
    'meeting',
    'inquiry',
    'private inquiry',
    'request',
  ];

  // DAYS OF WEEK
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  // TIME PATTERNS
  const timePatterns = [
    'at 8',
    'at 9',
    'at 10',
    'at 11',
    'at 12',
    'at 1',
    'at 2',
    'at 3',
    'at 4',
    'at 5',
    'at 6',
    'at 7',
  ];

  // SERVICES
  const services = [
    'banking',
    'residency',
    'citizenship',
    'visa',
    'contract',
    'dispute',
    'property',
    'company',
    'registration',
  ];

  // Check for booking keywords (MAIN TRIGGER)
  const hasBookingKeyword = bookingKeywords.some(kw => lowerMessage.includes(kw));

  // Check for days + time (SECONDARY TRIGGER)
  const hasDay = days.some(day => lowerMessage.includes(day));
  const hasTime = timePatterns.some(time => lowerMessage.includes(time));
  const hasService = services.some(svc => lowerMessage.includes(svc));

  // BOOKING DETECTED IF:
  // 1. Has booking keyword like "book", "schedule", "appointment", etc.
  // 2. OR has day + time (e.g., "sunday at 8")
  // 3. OR has day + service (e.g., "monday for banking")
  // 4. OR has time + service (e.g., "at 2 for residency")

  if (hasBookingKeyword) {
    return true;
  }

  if (hasDay && hasTime) {
    return true;
  }

  if (hasDay && hasService) {
    return true;
  }

  if (hasTime && hasService) {
    return true;
  }

  return false;
}
