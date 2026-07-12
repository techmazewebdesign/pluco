/**
 * Booking Intent Detection
 * Detects when a user wants to book a consultation from their message
 * Runs BEFORE Claude API is called - critical for UX
 * Uses simple keyword matching for reliability
 */

export function isBookingIntent(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const lowerMessage = message.toLowerCase().trim();

  // BOOKING KEYWORDS - Direct intent triggers
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
    'session',
    'reserve',
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
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
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
    'at 8am',
    'at 9am',
    'at 10am',
    'at 11am',
    'at 12pm',
    'at 1pm',
    'at 2pm',
    'at 3pm',
    'at 4pm',
    'at 5pm',
    'at 6pm',
    'at 7pm',
    'at 8pm',
    'at 9pm',
    '8am',
    '9am',
    '10am',
    '11am',
    '12pm',
    '1pm',
    '2pm',
    '3pm',
    '4pm',
    '5pm',
    '6pm',
    '7pm',
    '8pm',
    '9pm',
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
    'compliance',
  ];

  // Check for booking keywords (PRIMARY TRIGGER)
  const hasBookingKeyword = bookingKeywords.some(kw => lowerMessage.includes(kw));
  if (hasBookingKeyword) {
    console.log('[Booking] Detected via keyword');
    return true;
  }

  // Check for secondary combinations
  const hasDay = days.some(day => lowerMessage.includes(day));
  const hasTime = timePatterns.some(time => lowerMessage.includes(time));
  const hasService = services.some(svc => lowerMessage.includes(svc));

  // BOOKING DETECTED IF:
  // 1. Has booking keyword (checked above)
  // 2. OR has day + time (e.g., "sunday at 8")
  // 3. OR has day + service (e.g., "monday for banking")
  // 4. OR has time + service (e.g., "at 2 for residency")
  // 5. OR has day alone
  // 6. OR has time alone

  if (hasDay && hasTime) {
    console.log('[Booking] Detected via day + time');
    return true;
  }

  if (hasDay && hasService) {
    console.log('[Booking] Detected via day + service');
    return true;
  }

  if (hasTime && hasService) {
    console.log('[Booking] Detected via time + service');
    return true;
  }

  if (hasDay) {
    console.log('[Booking] Detected via day');
    return true;
  }

  if (hasTime) {
    console.log('[Booking] Detected via time');
    return true;
  }

  console.log('[Booking] No intent detected');
  return false;
}

/**
 * Extract booking details from message (optional, for future use)
 */
export function extractBookingDetails(message: string) {
  const lowerMessage = message.toLowerCase();

  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

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

  return {
    hasDay: days.some(day => lowerMessage.includes(day)),
    hasTime: timePatterns.some(time => lowerMessage.includes(time)),
    hasService: services.some(service => lowerMessage.includes(service)),
    services: services.filter(service => lowerMessage.includes(service)),
  };
}
