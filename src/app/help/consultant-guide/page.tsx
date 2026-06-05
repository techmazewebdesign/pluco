'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, Video, CheckCircle, AlertCircle, Lightbulb,
  MessageSquare, Calendar, Clock, Settings, Users, Star, Globe, HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface TrainingModule {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: TrainingSection[];
}

interface TrainingSection {
  title: string;
  content: string;
  tips?: string[];
  videoUrl?: string;
}

const trainingModules: TrainingModule[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    icon: <Users className="w-6 h-6" />,
    description: 'Learn how to navigate and understand your consultant dashboard',
    sections: [
      {
        title: 'Dashboard Layout',
        content: `Your consultant dashboard is your command center. It displays:

        • Real-time statistics (today's consultations, upcoming bookings, completed sessions, average rating)
        • Quick access to upcoming consultations with client details
        • Navigation to key sections (bookings, availability, reviews, profile)
        • Status indicators for pending confirmations

        The dashboard updates in real-time as bookings come in and change status.`,
        tips: [
          'Check your dashboard first thing each day to see today\'s schedule',
          'Confirm pending bookings as soon as possible to give clients certainty',
          'Monitor your rating and aim to maintain excellent feedback'
        ]
      },
      {
        title: 'Statistics & Metrics',
        content: `Understand what each stat means:

        • Today Count: Number of consultations scheduled for today (pending or confirmed)
        • Upcoming: Confirmed consultations coming up in the future
        • Completed: Total number of finished consultations (impacts your experience score)
        • Rating: Your average rating out of 5 stars based on client reviews

        These metrics help clients decide if they want to book with you.`,
        tips: [
          'Higher ratings lead to more bookings - focus on providing excellent service',
          'Complete consultations regularly to build your experience score',
          'Respond professionally to all client interactions'
        ]
      }
    ]
  },
  {
    id: 'bookings',
    title: 'Managing Bookings',
    icon: <Calendar className="w-6 h-6" />,
    description: 'Confirm, cancel, and manage your consultation bookings',
    sections: [
      {
        title: 'Viewing Bookings',
        content: `Access your bookings from the "Manage Bookings" section:

        • Pending: Clients who want to book but haven't received confirmation
        • Confirmed: Approved bookings ready to happen
        • Completed: Past consultations (can add notes and reviews here)
        • Cancelled: Cancelled bookings with reason tracking

        Click on any booking to see full details and take action.`,
        tips: [
          'Filter by status to quickly find pending bookings that need action',
          'Review client details before each consultation',
          'Note timezone differences for international clients'
        ]
      },
      {
        title: 'Confirming Bookings',
        content: `When a client books a consultation:

        1. You receive a notification with their booking details
        2. Review the booking (client info, time, topic, platform)
        3. Click "Confirm Booking" if you can attend
        4. System sends confirmation email to client automatically
        5. Meeting link becomes active in the booking

        Best practice: Confirm within 24 hours of booking request.`,
        tips: [
          'Only confirm if you\'re certain about the date/time',
          'If you need to reschedule, cancel and ask client to rebook',
          'Confirming shows you\'re reliable and available'
        ]
      },
      {
        title: 'Creating Meeting Links',
        content: `Set up your meeting platform before the consultation:

        GOOGLE MEET (Recommended):
        • Auto-generates a meeting link
        • No setup needed, works in browser
        • Easy screen sharing for documents

        DISCORD:
        • Create a private channel or invite to server
        • Good for group discussions
        • Built-in chat and voice quality

        ZOOM / TEAMS / OTHER:
        • Paste your pre-made meeting link
        • Ensure link is set to start when you join
        • Send link to client in advance

        Always test your platform 5 minutes before the meeting starts.`,
        tips: [
          'Have your platform open and tested before client joins',
          'Share meeting link in the booking confirmation',
          'Use Google Meet for 1-on-1, Discord for group consultations',
          'Record consultation (with client permission) for your records'
        ]
      },
      {
        title: 'Handling Cancellations',
        content: `If you need to cancel a booking:

        1. Click the booking
        2. Select "Cancel Consultation"
        3. Provide a reason (client reschedule, emergency, etc.)
        4. Client receives cancellation notification
        5. They can rebook with you or another consultant

        Be professional when cancelling. Frequent cancellations hurt your rating.`,
        tips: [
          'Avoid cancellations - they reduce your reliability score',
          'If needed, cancel as soon as possible',
          'Offer alternative times when possible',
          'Never cancel right before the scheduled time'
        ]
      }
    ]
  },
  {
    id: 'availability',
    title: 'Setting Availability',
    icon: <Clock className="w-6 h-6" />,
    description: 'Configure your working hours and timezone',
    sections: [
      {
        title: 'Timezone Configuration',
        content: `Set your timezone so clients see your available times in their own timezone:

        1. Go to "Set Availability"
        2. Select your timezone (e.g., UTC, EST, CET)
        3. All times will be automatically converted for clients

        Why this matters:
        • Prevents scheduling errors across different time zones
        • Shows professionalism
        • Helps international clients book at convenient times

        Common timezones:
        • UTC: Greenwich Mean Time
        • CET: Central European Time (winter)
        • EST: Eastern Standard Time (US)
        • IST: Indian Standard Time`,
        tips: [
          'Set your actual timezone, not a different one',
          'Remember daylight saving time changes',
          'Update timezone if you travel for extended periods'
        ]
      },
      {
        title: 'Working Hours',
        content: `Define when you\'re available for consultations:

        1. Select day of week (Mon-Sun)
        2. Set start time (e.g., 09:00 AM)
        3. Set end time (e.g., 05:00 PM)
        4. Toggle "Available" to enable/disable that day

        Example schedule:
        • Monday-Friday: 09:00 AM - 05:00 PM ✓
        • Saturday: 10:00 AM - 02:00 PM ✓
        • Sunday: Not Available ✗

        Clients can only book during your available times.`,
        tips: [
          'Be realistic about your schedule - don\'t overcommit',
          'Include time between consultations for prep and notes',
          'Leave 30min-1hr gaps for back-to-back meetings',
          'Update availability weekly based on your schedule'
        ]
      },
      {
        title: 'Break Times & Vacation',
        content: `Manage your time off:

        BREAK TIMES (within your working day):
        • Block off time for lunch, admin work, etc.
        • Mark as unavailable during these hours
        • Prevents client bookings during breaks

        VACATION / TIME OFF:
        • Disable your account temporarily
        • Or set "Not Available" for those dates
        • Clients see you as unavailable
        • They can book with other consultants

        Always notify clients and admin about extended time off.`,
        tips: [
          'Plan time off in advance',
          'Notify admin team 2 weeks before vacation',
          'Suggest alternative consultants to interested clients',
          'Don\'t leave your calendar active if you\'re away'
        ]
      }
    ]
  },
  {
    id: 'meetings',
    title: 'Running Consultations',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'Best practices for conducting excellent consultations',
    sections: [
      {
        title: 'Preparation',
        content: `Before each consultation:

        1. Review client details (name, topic, description, timezone)
        2. Test your internet connection and audio/video
        3. Open your meeting platform and test it works
        4. Have relevant documents/resources ready
        5. Find a quiet, professional location
        6. Arrive 5 minutes early

        Professional setup:
        • Good lighting (face visible)
        • Professional background or blurred
        • Minimal distractions/noise
        • Dress professionally`,
        tips: [
          'Have a backup internet connection ready (mobile hotspot)',
          'Close unnecessary browser tabs/apps',
          'Use headphones for better audio quality',
          'Have water nearby for longer sessions'
        ]
      },
      {
        title: 'During Consultation',
        content: `Conduct professional, effective sessions:

        1. Start on time, greet the client warmly
        2. Confirm they can see/hear you clearly
        3. Explain what you'll cover (agenda)
        4. Listen actively - take notes
        5. Answer questions thoroughly
        6. Summarize action items at end
        7. Suggest follow-up if needed
        8. End on time (respect their time)

        Key behaviors:
        • Maintain eye contact (look at camera)
        • Avoid multitasking
        • Speak clearly and professionally
        • Ask clarifying questions
        • Provide specific advice
        • Be empathetic and understanding`,
        tips: [
          'Mute notifications during the call',
          'Write down action items for your records',
          'If technical issues occur, have a backup plan',
          'Record consultation (with permission) for your notes'
        ]
      },
      {
        title: 'After Consultation',
        content: `Follow up promptly:

        1. Mark consultation as completed in the system
        2. Add consultation notes/summary
        3. Send follow-up email with action items
        4. Attach any documents/resources discussed
        5. Set reminder for follow-up if needed
        6. Wait for client to leave review

        Creating records:
        • Date, time, duration
        • Client name and contact
        • Topics discussed
        • Action items & owner
        • Next steps / follow-up date
        • Outcome or recommendation

        This helps you track progress with clients.`,
        tips: [
          'Send follow-up within 24 hours while fresh',
          'Include all promised documents/links',
          'Be clear about next steps',
          'Thank the client for their time',
          'Make it easy for them to leave a review'
        ]
      },
      {
        title: 'Communication Tips',
        content: `Build strong client relationships:

        LISTENING:
        • Let client finish before responding
        • Ask follow-up questions to understand better
        • Don't interrupt or assume

        EMPATHY:
        • Acknowledge client concerns
        • Show you understand their situation
        • Be supportive and encouraging

        CLARITY:
        • Explain complex topics simply
        • Use examples when helpful
        • Confirm understanding

        PROFESSIONALISM:
        • Be punctual always
        • Follow through on commitments
        • Maintain confidentiality
        • Respect client time

        PROBLEM-SOLVING:
        • Focus on solutions, not problems
        • Offer options when possible
        • Be realistic about outcomes`,
        tips: [
          'Take notes during calls - shows you care',
          'Remember client details from previous calls',
          'Follow up on action items you promised',
          'Be honest if you don\'t know something'
        ]
      }
    ]
  },
  {
    id: 'reviews',
    title: 'Reviews & Ratings',
    icon: <Star className="w-6 h-6" />,
    description: 'Understand and manage client feedback',
    sections: [
      {
        title: 'How Ratings Work',
        content: `Client reviews directly impact your success:

        RATING SCALE (1-5 stars):
        • 5 stars: Excellent, would recommend
        • 4 stars: Good, very satisfied
        • 3 stars: Okay, some issues
        • 2 stars: Poor, disappointed
        • 1 star: Very poor, would not use again

        YOUR AVERAGE RATING:
        • Calculated from all client reviews
        • Displayed on your profile
        • Used by clients to choose consultants
        • Target: 4.5+ stars

        REVIEW CONTENT:
        • Clients rate your professionalism, knowledge, helpfulness
        • They write comments about their experience
        • Positive reviews boost your profile
        • Negative reviews show areas for improvement`,
        tips: [
          'Always aim for 5-star service',
          'Remember: ratings are public and visible to future clients',
          'One bad review can affect your average - avoid them',
          'Monitor your average rating weekly'
        ]
      },
      {
        title: 'Improving Your Rating',
        content: `Strategies to earn excellent reviews:

        BEFORE THE CONSULTATION:
        ✓ Confirm bookings promptly (within 24 hours)
        ✓ Send meeting link in advance
        ✓ Provide brief intro about yourself
        ✓ Set clear expectations for the session

        DURING THE CONSULTATION:
        ✓ Start and end on time
        ✓ Be fully present and engaged
        ✓ Listen carefully to understand needs
        ✓ Provide valuable, specific advice
        ✓ Be professional and courteous
        ✓ Answer all questions thoroughly

        AFTER THE CONSULTATION:
        ✓ Send follow-up message within 24 hours
        ✓ Provide promised materials
        ✓ Offer continued support if needed
        ✓ Ask client to leave a review (politely)
        ✓ Thank them for their time

        WHAT CLIENTS VALUE:
        • Expertise and knowledge
        • Clear, understandable advice
        • Professional demeanor
        • Respect for their time
        • Follow-through on commitments
        • Personalized attention`,
        tips: [
          'Aim to over-deliver on every consultation',
          'Treat every client like they\'re your only client',
          'Show genuine interest in solving their problem',
          'Go extra mile when possible'
        ]
      },
      {
        title: 'Handling Negative Reviews',
        content: `Not every review will be 5 stars. Here's how to handle it:

        WHEN YOU SEE A NEGATIVE REVIEW:

        1. Don't react emotionally - take a moment
        2. Read carefully to understand the concern
        3. Consider if feedback is valid or misunderstanding
        4. Draft a professional response (if system allows)

        PROFESSIONAL RESPONSE:
        "Thank you for your feedback. I apologize if I didn't meet your expectations.
        I'd like to make this right. Please contact me directly at [email] so we can discuss
        and find a solution."

        LEARN & IMPROVE:
        • Identify what went wrong
        • Adjust your approach for future consultations
        • Don't make the same mistake twice
        • Address root cause, not just symptom

        WHAT NOT TO DO:
        ✗ Get defensive or argue with client
        ✗ Make excuses
        ✗ Delete negative reviews (not possible anyway)
        ✗ Ignore constructive criticism
        ✗ Attack the client`,
        tips: [
          'Every negative review is a learning opportunity',
          'Your response to criticism shows your character',
          'Most clients appreciate if you acknowledge issues',
          'Consistent 4+ stars shows reliability'
        ]
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Support',
    icon: <HelpCircle className="w-6 h-6" />,
    description: 'Common issues and how to solve them',
    sections: [
      {
        title: 'Technical Issues',
        content: `Common technical problems and solutions:

        INTERNET CONNECTION:
        Problem: Dropping calls, lag during consultation
        Solution:
        • Check your WiFi speed (run speedtest.net)
        • Move closer to router
        • Use Ethernet cable if possible
        • Close other applications using bandwidth
        • Have mobile hotspot as backup
        • Restart router if repeated issues

        AUDIO/VIDEO:
        Problem: Client can't hear you or see you
        Solution:
        • Check microphone/camera settings in app
        • Test before each call
        • Check audio input device selection
        • Ensure camera is not blocked
        • Update browser/app to latest version

        MEETING LINK NOT WORKING:
        Problem: Client can't join the meeting
        Solution:
        • Regenerate Google Meet link
        • Double-check link is correct
        • Ensure you've started the meeting
        • Send link again via email
        • Have backup platform ready`,
        tips: [
          'Always test your setup before calls',
          'Keep backup power source charged',
          'Know how to troubleshoot basic tech issues',
          'Contact IT support if persistent problems'
        ]
      },
      {
        title: 'Common Challenges',
        content: `Handling typical situations:

        CLIENT SHOWS UP LATE:
        • Don't start without them
        • Send them a message after 5 minutes
        • Wait 10-15 minutes maximum
        • If no response, mark as no-show
        • Follow up after - they may have had emergency

        CLIENT DOESN'T SHOW UP:
        • Mark as "No Show" in system
        • Send friendly message checking if OK
        • Offer to reschedule if genuine emergency
        • Frequent no-shows may need to restrict booking

        DIFFICULT CLIENT:
        • Stay professional and calm
        • Listen without judgment
        • Set boundaries if needed
        • Escalate to manager if necessary
        • Focus on solutions, not blame

        OUTSIDE SCOPE QUESTIONS:
        • Be honest if it's not your expertise
        • Refer to appropriate specialist
        • Offer to help find resources
        • Don't pretend to know what you don't

        CLIENT WANTS TO CONTINUE:
        • Check time remaining
        • Offer to extend if time allows
        • Suggest follow-up consultation
        • Don't go way over time
        • Charge for extended time if company policy`,
        tips: [
          'Have policies ready for common situations',
          'Stay professional in difficult interactions',
          'Document unusual situations',
          'Ask for guidance if unsure'
        ]
      },
      {
        title: 'Getting Help',
        content: `How to get support when you need it:

        FOR TECHNICAL ISSUES:
        • Check FAQ section
        • Email: support@plucogroup.com
        • Attach screenshots of errors
        • Describe steps that led to issue

        FOR BUSINESS QUESTIONS:
        • Email your admin contact
        • Ask about best practices
        • Request guidance on policies
        • Join training sessions

        FOR CLIENT ISSUES:
        • Escalate to case manager
        • Document what happened
        • Provide email/chat transcripts
        • Ask for backup if needed

        FEEDBACK & SUGGESTIONS:
        • Share what's working well
        • Suggest features/improvements
        • Help make the platform better
        • Join consultant advisory group`,
        tips: [
          'Don\'t struggle alone - ask for help',
          'Support team wants to help you succeed',
          'Provide details when reporting issues',
          'Join team meetings for updates'
        ]
      }
    ]
  }
];

export default function ConsultantGuidePage() {
  const [expandedModule, setExpandedModule] = useState<string>('dashboard');
  const [expandedSection, setExpandedSection] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? '' : moduleId);
    setExpandedSection({});
  };

  const toggleSection = (moduleId: string, sectionIndex: number) => {
    const key = `${moduleId}-${sectionIndex}`;
    setExpandedSection(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-sm font-semibold px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB', color: '#5E6470' }}>
              ← Back
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8" style={{ color: '#C9A35A' }} />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#071C3C' }}>Consultant Guide</h1>
              <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                Learn how to use your consultant dashboard and run successful consultations
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {trainingModules.map(module => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div style={{ color: '#C9A35A' }}>{module.icon}</div>
                  <div className="text-left">
                    <h2 className="font-bold text-lg" style={{ color: '#1E2430' }}>{module.title}</h2>
                    <p className="text-sm" style={{ color: '#5E6470' }}>{module.description}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform flex-shrink-0 ${
                    expandedModule === module.id ? 'rotate-180' : ''
                  }`}
                  style={{ color: '#C9A35A' }}
                />
              </button>

              {/* Module Content */}
              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {module.sections.map((section, sectionIndex) => {
                        const sectionKey = `${module.id}-${sectionIndex}`;
                        const isExpanded = expandedSection[sectionKey];

                        return (
                          <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleSection(module.id, sectionIndex)}
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <h3 className="font-semibold" style={{ color: '#1E2430' }}>{section.title}</h3>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform flex-shrink-0 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                                style={{ color: '#94A3B8' }}
                              />
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-gray-200 bg-gray-50 p-4"
                                >
                                  <div className="space-y-4">
                                    {/* Content */}
                                    <div className="text-sm leading-relaxed" style={{ color: '#374151', whiteSpace: 'pre-wrap' }}>
                                      {section.content}
                                    </div>

                                    {/* Tips */}
                                    {section.tips && section.tips.length > 0 && (
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex gap-3">
                                          <Lightbulb className="w-5 h-5 flex-shrink-0" style={{ color: '#0369A1' }} />
                                          <div>
                                            <p className="font-semibold text-sm mb-2" style={{ color: '#0369A1' }}>
                                              💡 Pro Tips:
                                            </p>
                                            <ul className="space-y-1">
                                              {section.tips.map((tip, i) => (
                                                <li key={i} className="text-sm" style={{ color: '#0C4A6E' }}>
                                                  • {tip}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-3">
            <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#0369A1' }} />
            <div>
              <p className="font-semibold mb-2" style={{ color: '#0369A1' }}>
                Ready to start consulting?
              </p>
              <p className="text-sm mb-4" style={{ color: '#0C4A6E' }}>
                You've learned the basics! Remember to apply these principles in every consultation.
                Provide excellent service, communicate professionally, and continuously improve based on feedback.
              </p>
              <Link href="/consultant/dashboard"
                className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm"
                style={{ backgroundColor: '#0369A1', color: 'white' }}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
