'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface HelpItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: HelpItem[];
  title: string;
}

export default function HelpPanel({ isOpen, onClose, items, title }: HelpPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#071C3C] to-[#0B234A] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-bold font-serif">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
                    <h3 className="font-semibold" style={{ color: '#1E2430' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: '#5E6470' }}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 rounded-lg font-semibold transition-all text-white"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
