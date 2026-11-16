/**
 * Booking Intent Detection
 * Detects when a user wants to book a consultation from their message
 * Runs BEFORE Claude API is called - critical for UX
 * Uses simple keyword matching for reliability
 */

export function isBookingIntent(message: string): boolean {
  const text = message.trim().toLowerCase();
  // Asking how consultations work should get an answer, even though it mentions booking.
  if (/^(?:how|what|when|where)\b|^(?:چگونه|چطور|چیست|چه|هزینه)/u.test(text) && !/^(?:how (?:do|can) i (?:book|schedule|request)|چطور می.توانم رزرو کنم)/u.test(text)) return false;
  return /\b(?:book|schedule|arrange|reserve|request|set up|make)\b.{0,35}\b(?:consultation|call|appointment|meeting|inquiry|session)\b/u.test(text)
    || /^(?:(?:a |an )?(?:consultation|appointment)|(?:book|schedule)(?: now)?)\??$/u.test(text)
    || /\b(?:want|need|like)\b.{0,20}\b(?:a |an )(?:consultation|appointment|call|meeting)\b/u.test(text)
    || /^(?:consultation|appointment|meeting|call)\s+(?:please|for|on)\b/u.test(text)
    || /^(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.{0,25}\bat\s+\d{1,2}\b/u.test(text)
    || /(?:رزرو|هماهنگ|تعیین|درخواست).{0,18}(?:مشاوره|وقت|جلسه)|(?:وقت|مشاوره).{0,18}(?:می.خواهم|بگیرم|رزرو)/u.test(text);
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
