/**
 * Detect if user message is about booking/consultation
 */
export function isBookingIntent(message: string): boolean {
  const bookingKeywords = [
    // Core booking words
    'book',
    'booking',
    'consultation',
    'consult',
    'schedule',
    'appointment',
    'call',
    'meeting',
    'inquiry',
    'inquire',
    'request',
    'talk',
    'speak',
    'discuss',
    'discussion',
    'speak with',
    'talk to',
    'speak to',
    'private inquiry',
    'private consultation',
    'consultation request',
    'consultation call',
    'schedule call',
    'book appointment',
    'book consultation',
    'schedule consultation',
    'set up',
    'arrange',
    'organize',
    'reserve',
    'reserve time',
    'want to',
    'would like to',
    'interested in',
    'need help',
    'need advice',
    'need consultation',
    'help with',
    'assist',
    'support',

    // Days of week
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'tomorrow',
    'next week',
    'this week',
    'soon',

    // Time patterns
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
    'am',
    'pm',
    'morning',
    'afternoon',
    'evening',
    'time',
    'slot',
    'available',

    // Services
    'banking',
    'residency',
    'citizenship',
    'identity',
    'visa',
    'contract',
    'dispute',
    'property',
    'company',
    'registration',
    'eu',
    'green card',
    'eb-5',
    'compliance',
  ];

  const lowerMessage = message.toLowerCase().trim();

  // Check for keyword matches
  const hasKeyword = bookingKeywords.some(keyword => lowerMessage.includes(keyword));

  // Additional check: if message contains time/date info with booking words
  const hasTimePattern = /(\d{1,2}):?(\d{2})?\s*(am|pm)?|at\s+\d|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next\s+week/i.test(message);
  const hasBookingWord = /book|consult|schedule|appointment|call|meeting|inquiry|request|private|talk|speak|discuss|want|interested|help/i.test(message);

  return hasKeyword || (hasTimePattern && hasBookingWord);
}
