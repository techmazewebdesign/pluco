'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChatMessage, ChatSession, ChatRole } from '@/lib/types/chatbot';
import InquiryForm from './InquiryForm';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasWelcome, setHasWelcome] = useState(false);

  // Load existing session and messages
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionRef = doc(db, 'chatSessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
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
          setMessages(loadedMessages);
          setHasWelcome(true);
        } else {
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
          setSession(newSession);

          // Add welcome message
          const welcomeMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: "Hello! I'm Pluco Assistant. I can answer general questions about residency, citizenship, banking, company registration, and consultations. I cannot give legal advice, but I can guide you to the right next step. What would you like to know?",
            createdAt: now,
          };
          await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), welcomeMessage);
          setMessages([welcomeMessage]);
          setHasWelcome(true);
        }
      } catch (err) {
        console.error('Error loading session:', err);
        setError('Failed to load chat');
      }
    };

    loadSession();
  }, [sessionId]);

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

    // Add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to Firestore
      await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), userMessage);

      // Get assistant response
      const response = await fetch('/api/faq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userMessage: content.trim(),
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        createdAt: new Date().toISOString(),
      };

      // Save assistant message
      await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);

      // Update session timestamp
      const sessionRef = doc(db, 'chatSessions', sessionId);
      await updateDoc(sessionRef, {
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFAQButtonClick = (question: string) => {
    sendMessage(question);
  };

  const handleInquirySubmit = async (data: { name: string; email: string; phone: string; service: string; nationality: string; residenceCountry: string }) => {
    try {
      // Update session with visitor info
      const sessionRef = doc(db, 'chatSessions', sessionId);
      await updateDoc(sessionRef, {
        visitorName: data.name,
        visitorEmail: data.email,
        visitorPhone: data.phone,
        serviceInterest: data.service,
        leadStatus: 'qualified',
        updatedAt: new Date().toISOString(),
      });

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

      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, inquiry);

      // Add system message confirming inquiry
      const confirmMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'system',
        content: `Thank you, ${data.name}! We've received your information. Our team will review your inquiry and contact you at ${data.email} or ${data.phone} soon.`,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), confirmMessage);
      setMessages(prev => [...prev, confirmMessage]);
      setShowInquiryForm(false);

      setSession(prev => prev ? { ...prev, leadStatus: 'qualified' } : null);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('Failed to submit inquiry. Please try again.');
    }
  };

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
      {messages.length <= 1 && !showInquiryForm && (
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

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white space-y-2">
        {!showInquiryForm && (
          <>
            <button
              onClick={() => setShowInquiryForm(true)}
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
