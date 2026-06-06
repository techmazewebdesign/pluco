'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { ChatMessage, ChatSession, ChatRole } from '@/lib/types/chatbot';
import InquiryForm from './InquiryForm';
import ConsultationForm from './ConsultationForm';
import { isBookingIntent, BOOKING_TRIGGER_RESPONSE } from '@/lib/utils/bookingDetection';

const FAQ_BUTTONS = [
  'Which service do I need?',
  'How does consultation work?',
  'What documents are needed?',
  'Can Pluco help with banking?',
  'Can Pluco help with EU residency?',
  'Can Pluco help with second citizenship?',
];

interface ChatWindowProps {
  sessionId: string;
  onClose: () => void;
}

export default function ChatWindow({ sessionId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasWelcome, setHasWelcome] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(true);

  // Authenticate user and load session
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        setIsAuthenticating(true);
        console.log('[Chatbot] Starting authentication...');

        // Wait for auth to be ready
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            if (!user) {
              console.log('[Chatbot] No authenticated user, signing in anonymously...');
              const anonResult = await signInAnonymously(auth);
              console.log('[Chatbot] Anonymous sign-in successful. UID:', anonResult.user.uid);
            } else {
              console.log('[Chatbot] User already authenticated. UID:', user.uid);
            }

            // Now load the session
            await loadSession();
            setIsAuthenticating(false);
          } catch (authErr: any) {
            console.error('[Chatbot] Authentication error:', authErr?.code, authErr?.message);
            setError('Authentication failed. Chat may have limited functionality.');
            setIsAuthenticating(false);
          }
        });
      } catch (err: any) {
        console.error('[Chatbot] Auth initialization error:', err?.code, err?.message);
        setError('Unable to initialize chat. Please refresh the page.');
        setIsAuthenticating(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Load existing session and messages
  const loadSession = async () => {
    try {
      console.log('[Chatbot] Loading session:', sessionId);
      const sessionRef = doc(db, 'chatSessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);

      if (sessionSnap.exists()) {
        console.log('[Chatbot] Session found, loading messages...');
        const sessionData = sessionSnap.data() as ChatSession;
        setSession(sessionData);

        // Load messages
        const messagesRef = collection(db, 'chatSessions', sessionId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
        const messagesSnap = await getDocs(messagesQuery);
        const loadedMessages = messagesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage));
        console.log('[Chatbot] Loaded', loadedMessages.length, 'messages');
        setMessages(loadedMessages);
        setHasWelcome(true);
      } else {
        console.log('[Chatbot] No existing session, creating new one...');
        // Create new session
        const now = new Date().toISOString();
        const newSession: ChatSession = {
          sessionId,
          createdAt: now,
          updatedAt: now,
          leadStatus: 'new',
          source: 'faq-chatbot',
        };
        await setDoc(sessionRef, newSession);
        console.log('[Chatbot] New session created');
        setSession(newSession);

        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: "Hello! I'm Pluco Assistant. I can answer general questions about residency, citizenship, banking, company registration, and consultations. I cannot give legal advice, but I can guide you to the right next step. What would you like to know?",
          createdAt: now,
        };
        await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), welcomeMessage);
        console.log('[Chatbot] Welcome message added');
        setMessages([welcomeMessage]);
        setHasWelcome(true);
      }
    } catch (err: any) {
      console.error('[Chatbot] Error loading session:', err?.code, err?.message);

      // Diagnose the error
      if (err?.code?.includes('permission-denied')) {
        console.error('[Chatbot] FIRESTORE PERMISSION DENIED - Check Firestore rules');
        setError('Unable to load chat history, but you can still ask questions. They won\'t be saved.');
        setFirebaseAvailable(false);
      } else if (err?.code?.includes('unavailable')) {
        console.error('[Chatbot] FIRESTORE UNAVAILABLE - Service down or network issue');
        setError('Chat service temporarily unavailable. Please try again in a moment.');
      } else if (err?.code?.includes('unauthenticated')) {
        console.error('[Chatbot] UNAUTHENTICATED - Auth failed');
        setError('Unable to authenticate. Chat may not work properly.');
      } else {
        setError('Unable to load chat history. Chat may have limited functionality.');
      }

      // Set welcome message anyway so user can still chat
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: "Hello! I'm Pluco Assistant. I can answer general questions about residency, citizenship, banking, company registration, and consultations. I cannot give legal advice, but I can guide you to the right next step. What would you like to know?",
        createdAt: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      setHasWelcome(true);

      // Create minimal session
      const now = new Date().toISOString();
      setSession({
        sessionId,
        createdAt: now,
        updatedAt: now,
        leadStatus: 'new',
        source: 'faq-chatbot',
      });
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !session) return;

    setError('');
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try to save user message to Firestore (non-blocking if fails)
      if (firebaseAvailable) {
        try {
          console.log('[Chatbot] Saving user message to Firestore...');
          await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), userMessage);
          console.log('[Chatbot] User message saved');
        } catch (firebaseErr: any) {
          console.warn('[Chatbot] Failed to save message to Firestore:', firebaseErr?.code);
          if (firebaseErr?.code?.includes('permission-denied')) {
            setFirebaseAvailable(false);
            console.error('[Chatbot] FIRESTORE PERMISSION DENIED - Continuing with API only');
          }
          // Continue anyway - we can still use the API
        }
      }

      // Get assistant response from API
      console.log('[Chatbot] Calling /api/pluco-assistant...');
      console.log('[Chatbot] Message:', content.trim());
      console.log('[Chatbot] Session:', sessionId);
      console.log('[Chatbot] History messages:', messages.length);

      const response = await fetch('/api/pluco-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          sessionId: sessionId,
          history: messages.slice(-8).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      console.log('[Chatbot] API response status:', response.status);

      // Parse response
      const data = await response.json();
      console.log('[Chatbot] Response:', {
        status: data.status,
        success: data.success,
        errorType: data.errorType,
        routeReached: data.routeReached,
        envKeyExists: data.envKeyExists,
        hasMessage: data.hasMessage,
        hasAssistantMessage: !!data.assistantMessage
      });

      // Check if API returned an error
      if (!response.ok || !data.success) {
        console.error('[Chatbot] API error:', response.status, data.errorType, data.message);

        // Diagnose the error from the API
        if (data.errorType === 'MISSING_MESSAGE') {
          console.error('[Chatbot] ERROR: No message was sent to the API. Check request body.');
          throw new Error('No message sent to server. Please try again.');
        } else if (data.errorType === 'MISSING_API_KEY') {
          console.error('[Chatbot] ERROR: ANTHROPIC_API_KEY is not set in Vercel environment');
          throw new Error('AI service not configured. Please add ANTHROPIC_API_KEY to Vercel.');
        } else if (data.errorType === 'ANTHROPIC_AUTH_ERROR') {
          console.error('[Chatbot] ERROR: Anthropic API key is invalid or expired');
          throw new Error('API authentication failed. Check Anthropic API key.');
        } else if (data.errorType === 'ANTHROPIC_BILLING_ERROR') {
          console.error('[Chatbot] ERROR: Anthropic account has no credits');
          throw new Error('Anthropic account needs credits. Add payment method.');
        } else if (data.errorType === 'ANTHROPIC_MODEL_ERROR') {
          console.error('[Chatbot] ERROR: Claude model not found:', data.modelAttempted);
          throw new Error(data.message || 'AI model not available. Contact support.');
        } else if (data.errorType === 'ANTHROPIC_SERVICE_ERROR') {
          console.error('[Chatbot] ERROR: Anthropic service error');
          throw new Error('AI service is temporarily unavailable. Try again later.');
        } else if (data.errorType === 'ANTHROPIC_UNKNOWN_ERROR') {
          console.error('[Chatbot] ERROR: Unknown Anthropic error');
          throw new Error(data.message || 'Failed to get AI response. Try again.');
        } else {
          console.error('[Chatbot] ERROR: Unknown error type:', data.errorType);
          throw new Error(data.message || 'An error occurred. Please try again.');
        }
      }

      // Success: API returned a response
      if (!data.assistantMessage) {
        console.error('[Chatbot] ERROR: No assistant message in response!');
        throw new Error('Empty response from AI. Please try again.');
      }

      console.log('[Chatbot] ✓ SUCCESS!');
      console.log('[Chatbot] Response:', data.assistantMessage.length, 'chars');
      console.log('[Chatbot] Model:', data.modelUsed);
      console.log('[Chatbot] Tokens:', data.tokensUsed);

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.assistantMessage,
        createdAt: new Date().toISOString(),
      };

      // Try to save assistant message to Firestore (non-blocking if fails)
      if (firebaseAvailable) {
        try {
          console.log('[Chatbot] Saving assistant message to Firestore...');
          await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), assistantMessage);
          console.log('[Chatbot] Assistant message saved');

          // Update session timestamp
          const sessionRef = doc(db, 'chatSessions', sessionId);
          await updateDoc(sessionRef, {
            updatedAt: new Date().toISOString(),
          });
        } catch (firebaseErr: any) {
          console.warn('[Chatbot] Failed to save assistant message:', firebaseErr?.code);
          if (firebaseErr?.code?.includes('permission-denied')) {
            setFirebaseAvailable(false);
          }
          // Continue anyway - message is shown in UI
        }
      }

      setMessages(prev => [...prev, assistantMessage]);

      // Check if user message indicates booking intent
      if (isBookingIntent(content.trim())) {
        console.log('[Chatbot] Booking intent detected!');
        setTimeout(() => {
          setShowConsultationForm(true);
        }, 500);
      }
    } catch (err: any) {
      console.error('[Chatbot] Error in sendMessage:', err?.message || String(err));
      setError(err?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFAQButtonClick = (question: string) => {
    sendMessage(question);
  };

  const handleConsultationSubmitted = (formData: any) => {
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
        } catch (err: any) {
          console.warn('[Chatbot] Failed to update session:', err?.code);
        }

        try {
          // Save inquiry to bookings collection
          const bookingsRef = collection(db, 'bookings');
          await addDoc(bookingsRef, inquiry);
          console.log('[Chatbot] Inquiry saved to bookings');
        } catch (err: any) {
          console.warn('[Chatbot] Failed to save inquiry to bookings:', err?.code);
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
        } catch (err: any) {
          console.warn('[Chatbot] Failed to save confirmation message:', err?.code);
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
      setSession(prev => prev ? { ...prev, leadStatus: 'qualified' } : null);
    } catch (err: any) {
      console.error('[Chatbot] Error submitting inquiry:', err?.message || err);
      setError('Failed to submit inquiry. Please try again.');
    }
  };

  // Show loading state while authenticating
  if (isAuthenticating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-24 right-6 w-96 h-[600px] rounded-lg shadow-2xl flex flex-col z-50 bg-white border border-gray-200"
        style={{ maxWidth: 'calc(100vw - 48px)' }}
      >
        <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: '#071C3C' }}>
          <h3 className="font-semibold text-white">Pluco Assistant</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Starting chat...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-24 right-6 w-96 h-[600px] rounded-lg shadow-2xl flex flex-col z-50 bg-white border border-gray-200"
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
            <p className="text-xs text-gray-300">We typically reply within minutes</p>
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
        {messages.map(message => (
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
              <p className="text-sm">{message.content}</p>
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
      {messages.length <= 1 && !showInquiryForm && !showConsultationForm && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Quick questions:</p>
          <div className="space-y-2">
            {FAQ_BUTTONS.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleFAQButtonClick(question)}
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
            <button
              onClick={() => setShowConsultationForm(true)}
              className="w-full text-sm py-2 rounded font-semibold transition-all"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              Start Private Inquiry
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => sendMessage(input)}
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
