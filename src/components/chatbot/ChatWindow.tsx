'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { ChatMessage, ChatSession } from '@/lib/types/chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import InquiryForm from './InquiryForm';
import ConsultationForm from './ConsultationForm';
import { isBookingIntent } from '@/lib/utils/bookingDetection';

const FAQ_BUTTONS = {
  en: [
    'Which service do I need?',
    'How does consultation work?',
    'What documents are needed?',
    'Can Pluco help with banking?',
    'Can Pluco help with EU residency?',
    'Can Pluco help with second citizenship?',
  ],
  pl: [
    'Jakie usługi oferujecie?',
    'Jak wygląda konsultacja?',
    'Jakie dokumenty są potrzebne?',
    'Czy Pluco pomaga w sprawach bankowych?',
    'Czy Pluco pomaga w sprawach pobytu w Europie?',
    'Czy Pluco pomaga w uzyskaniu drugiego obywatelstwa?',
  ],
  fa: [
    'چه خدماتی ارائه می‌دهید؟',
    'مشاوره چگونه انجام می‌شود؟',
    'چه مدارکی لازم است؟',
    'آیا پلوکو در امور بانکی کمک می‌کند؟',
    'آیا پلوکو درباره اقامت اروپا راهنمایی می‌کند؟',
    'آیا پلوکو درباره تابعیت دوم راهنمایی می‌کند؟',
  ],
};

interface ChatWindowProps {
  sessionId: string;
  onClose: () => void;
}

export default function ChatWindow({ sessionId, onClose }: ChatWindowProps) {
  const { lang, isRTL } = useLanguage();
  const isPolish = lang === 'pl';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionReady = useRef<Promise<boolean> | null>(null);
  const hasConversation = useRef(false);
  const requestInProgress = useRef(false);
  const [firebaseAvailable, setFirebaseAvailable] = useState(false);
  const welcome: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: isRTL
      ? 'سلام، من دستیار پلوکو هستم. می‌توانم درباره اقامت، تابعیت، امور بانکی، ثبت شرکت و مشاوره راهنمایی کلی ارائه کنم. چه سؤالی دارید؟'
      : isPolish ? 'Dzień dobry, jestem asystentem Pluco. Mogę odpowiedzieć na ogólne pytania o pobyt, obywatelstwo, bankowość, rejestrację spółki i konsultacje. W czym mogę pomóc?'
      : 'Hello, I’m Pluco Assistant. I can answer general questions about residency, citizenship, banking, company registration and consultations. What would you like to know?',
    createdAt: '',
  };

  useEffect(() => {
    let active = true;
    sessionReady.current = (async () => {
      try {
        await auth.authStateReady();
        if (!active) return false;
        if (!auth.currentUser) await signInAnonymously(auth);
        if (!active) return false;

        const sessionRef = doc(db, 'chatSessions', sessionId);
        const snapshot = await getDoc(sessionRef);
        if (snapshot.exists()) {
          const stored = await getDocs(query(collection(sessionRef, 'messages'), orderBy('createdAt', 'asc')));
          if (active && !hasConversation.current) {
            setMessages(stored.docs.map(item => ({ ...item.data(), id: item.id } as ChatMessage)));
          }
        } else {
          if (!active) return false;
          const now = new Date().toISOString();
          const session: ChatSession = {
            sessionId, createdAt: now, updatedAt: now, leadStatus: 'new', source: 'faq-chatbot',
          };
          await setDoc(sessionRef, session);
        }
        if (active) setFirebaseAvailable(true);
        return true;
      } catch {
        return false;
      }
    })();

    return () => { active = false; };
  }, [sessionId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    const message = content.trim();
    if (!message || message.length > 2000 || requestInProgress.current) return;
    setError('');
    hasConversation.current = true;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages(previous => [...previous, userMessage]);
    setInput('');

    if (!isPolish && isBookingIntent(message)) {
      setShowConsultationForm(true);
      return;
    }

    requestInProgress.current = true;
    setIsLoading(true);
    try {
      const response = await fetch('/api/pluco-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({
          message, sessionId, locale: lang,
          history: messages.slice(-8).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || typeof data.assistantMessage !== 'string' || !data.assistantMessage.trim()) {
        throw new Error('Unexpected assistant response');
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.assistantMessage,
        createdAt: new Date().toISOString(),
      };
      setMessages(previous => [...previous, assistantMessage]);

      // Keep the reply independent of Firebase authentication and persistence.
      void sessionReady.current?.then(async available => {
        if (!available) return;
        const sessionRef = doc(db, 'chatSessions', sessionId);
        await addDoc(collection(sessionRef, 'messages'), userMessage);
        await addDoc(collection(sessionRef, 'messages'), assistantMessage);
        await updateDoc(sessionRef, { updatedAt: assistantMessage.createdAt });
      }).catch(() => undefined);
    } catch {
      setError(isRTL
        ? 'پاسخی دریافت نشد. دوباره تلاش کنید یا گزینه «درخواست محرمانه» را انتخاب کنید.'
        : isPolish ? 'Nie udało się uzyskać odpowiedzi. Spróbuj ponownie lub wyślij poufne zapytanie.'
        : 'We couldn’t reply. Please try again or choose “Start Private Inquiry”.');
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  };

  const handleConsultationSubmitted = (formData: { fullName: string }) => {
    // Add confirmation message to chat
    const confirmMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'system',
      content: `Thank you for your consultation request, ${formData.fullName}. This is not a confirmed appointment yet. Our team will review availability and conflict checks, then contact you to confirm.`,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, confirmMessage]);
    setShowConsultationForm(false);
  };

  const handleInquirySubmit = async (data: { name: string; email: string; phone: string; service: string; nationality: string; residenceCountry: string }) => {
    try {
      console.log('[Chatbot] Submitting inquiry...');

      // Create lead/inquiry record compatible with existing system
      const now = new Date().toISOString();
      const inquiry = {
        clientName: data.name,
        clientEmail: data.email,
        clientPhone: data.phone,
        service: data.service,
        message: `Chat conversation. Nationality: ${data.nationality}, Residence: ${data.residenceCountry}`,
        status: 'pending',
        source: 'faq-chatbot',
        sessionId,
        createdAt: now,
        updatedAt: now,
      };

      // Try to update session and save inquiry (prioritize inquiry save)
      if (firebaseAvailable) {
        try {
          // Update session with visitor info
          const sessionRef = doc(db, 'chatSessions', sessionId);
          await updateDoc(sessionRef, {
            visitorName: data.name,
            visitorEmail: data.email,
            visitorPhone: data.phone,
            serviceInterest: data.service,
            leadStatus: 'qualified',
            updatedAt: now,
          });
          console.log('[Chatbot] Session updated');
        } catch (err) {
          console.warn('[Chatbot] Failed to update session:', err instanceof Error ? err.name : 'unknown error');
        }

        try {
          // Save inquiry to bookings collection
          const bookingsRef = collection(db, 'bookings');
          await addDoc(bookingsRef, inquiry);
          console.log('[Chatbot] Inquiry saved to bookings');
        } catch (err) {
          console.warn('[Chatbot] Failed to save inquiry to bookings:', err instanceof Error ? err.name : 'unknown error');
        }

        try {
          // Add system message confirming inquiry
          const confirmMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'system',
            content: `Thank you, ${data.name}! We've received your information. Our team will review your inquiry and contact you at ${data.email} or ${data.phone} soon.`,
            createdAt: now,
          };
          await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), confirmMessage);
          setMessages(prev => [...prev, confirmMessage]);
          console.log('[Chatbot] Confirmation message saved');
        } catch (err) {
          console.warn('[Chatbot] Failed to save confirmation message:', err instanceof Error ? err.name : 'unknown error');
          // Still show confirmation to user even if save fails
          const confirmMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'system',
            content: `Thank you, ${data.name}! We've received your information. Our team will review your inquiry and contact you at ${data.email} or ${data.phone} soon.`,
            createdAt: now,
          };
          setMessages(prev => [...prev, confirmMessage]);
        }
      }

      setShowInquiryForm(false);
    } catch (err) {
      console.error('[Chatbot] Error submitting inquiry:', err instanceof Error ? err.name : 'unknown error');
      setError('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-24 right-6 w-96 h-[600px] max-h-[calc(100dvh-7rem)] rounded-lg shadow-2xl flex flex-col z-50 bg-white border border-gray-200"
      style={{ maxWidth: 'calc(100vw - 48px)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: '#071C3C' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: '#071C3C' }}>P</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Pluco Assistant</h3>
            <p className="text-xs text-gray-300">{isRTL ? 'راهنمای خدمات پلوکو' : isPolish ? 'Pytania o usługi Pluco' : 'General questions about Pluco services'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {(messages.length ? messages : [welcome]).map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p dir="auto" className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FAQ Buttons - Show if no conversation yet */}
      {!messages.some(message => message.role === 'user') && !showInquiryForm && !showConsultationForm && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-600 mb-2 font-semibold">{isRTL ? 'پرسش‌های رایج' : isPolish ? 'Najczęstsze pytania' : 'Quick questions'}</p>
          <div className="space-y-2">
            {FAQ_BUTTONS[lang].map((question) => (
              <button
                key={question}
                dir="auto"
                onClick={() => sendMessage(question)}
                disabled={isLoading}
                className="w-full text-left text-xs px-3 py-2 rounded border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Form */}
      {showInquiryForm && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white overflow-y-auto max-h-64">
          <InquiryForm onSubmit={handleInquirySubmit} onCancel={() => setShowInquiryForm(false)} />
        </div>
      )}

      {/* Consultation Form */}
      {showConsultationForm && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white overflow-y-auto max-h-96">
          <ConsultationForm
            sessionId={sessionId}
            onClose={() => setShowConsultationForm(false)}
            onSubmitted={handleConsultationSubmitted}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white space-y-2">
        {!showInquiryForm && !showConsultationForm && (
          <>
            {isPolish ? (
              <Link href="/pl/enquire" className="block w-full rounded bg-[#C9A35A] py-2 text-center text-sm font-semibold text-[#071C3C]">
                Wyślij poufne zapytanie
              </Link>
            ) : (
              <button
              onClick={() => setShowConsultationForm(true)}
              className="w-full text-sm py-2 rounded font-semibold transition-all"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              {isRTL ? 'درخواست محرمانه' : 'Start Private Inquiry'}
            </button>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && sendMessage(input)}
                placeholder={isRTL ? 'سؤال خود را بپرسید…' : isPolish ? 'Zadaj pytanie…' : 'Ask a question…'}
                aria-label={isRTL ? 'سؤال شما' : isPolish ? 'Twoje pytanie' : 'Your question'}
                dir="auto"
                maxLength={2000}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => sendMessage(input)}
                aria-label={isRTL ? 'ارسال' : isPolish ? 'Wyślij wiadomość' : 'Send message'}
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
