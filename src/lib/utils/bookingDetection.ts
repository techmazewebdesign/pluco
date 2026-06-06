/**
 * Detect if user message is about booking/consultation
 */
export function isBookingIntent(message: string): boolean {
  const bookingKeywords = [
    'book',
    'consultation',
    'schedule',
    'appointment',
    'call',
    'meeting',
    'inquiry',
    'request',
    'talk',
    'discussion',
    'consultation request',
    'private inquiry',
    'consultation call',
    'schedule call',
    'book appointment',
    'book consultation',
    'schedule consultation',
    'set up',
    'arrange',
    'organize',
    'reserve',
  ];

  const lowerMessage = message.toLowerCase().trim();

  // Check for exact keyword matches
  return bookingKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Booking response from AI
 */
export const BOOKING_TRIGGER_RESPONSE = `I can help you submit a consultation request. Please note this is not a confirmed appointment yet. Our team will review availability and conflict checks before confirming. Please fill in the short request form.`;
