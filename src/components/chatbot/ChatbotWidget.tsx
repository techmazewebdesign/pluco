'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ChatWindow to avoid hydration issues
const ChatWindow = dynamic(() => import('./ChatWindow'), { ssr: false });

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const toggleChat = () => {
    if (!sessionId) {
      let id = `session_${Date.now()}_${crypto.randomUUID()}`;
      try {
        const stored = localStorage.getItem('chatbot_session_id');
        if (stored) id = stored;
        else localStorage.setItem('chatbot_session_id', id);
      } catch {
        // The current chat can continue without local storage.
      }
      setSessionId(id);
    }
    setIsOpen(open => !open);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all"
        style={{
          backgroundColor: '#071C3C',
          color: '#FFFFFF',
        }}
        aria-label={isOpen ? "Hide chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && sessionId && <ChatWindow sessionId={sessionId} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
