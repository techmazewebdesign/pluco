'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TourWelcomeModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onContinue: () => void;
  onExit: () => void;
  onDoNotShowAgain: (value: boolean) => void;
  language?: 'en' | 'fa';
}

export default function TourWelcomeModal({
  isOpen,
  title,
  description,
  onContinue,
  onExit,
  onDoNotShowAgain,
  language = 'en',
}: TourWelcomeModalProps) {
  const [doNotShow, setDoNotShow] = useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    onDoNotShowAgain(doNotShow);
    onContinue();
  };

  const handleExit = () => {
    onDoNotShowAgain(doNotShow);
    onExit();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#071C3C] to-[#0B234A] px-6 py-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6" style={{ color: '#C9A35A' }} />
            <h2 className="text-2xl font-bold font-serif">{title}</h2>
          </div>
          <p className="text-sm opacity-90">{description}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Checkbox */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={doNotShow}
              onChange={(e) => setDoNotShow(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm" style={{ color: '#5E6470' }}>
              {language === 'fa' ? 'این راهنما دوباره نمایش داده نشود' : 'Do not show this tour again'}
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExit}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm border border-gray-300 hover:bg-gray-50"
              style={{ color: '#5E6470' }}
            >
              {language === 'fa' ? 'خروج از راهنما' : 'Exit Tour'}
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm text-white"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              {language === 'fa' ? 'شروع راهنما' : 'Continue Tour'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
