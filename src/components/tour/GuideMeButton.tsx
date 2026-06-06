'use client';

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface GuideMeButtonProps {
  onClick: () => void;
  tourCompleted?: boolean;
}

export default function GuideMeButton({ onClick, tourCompleted }: GuideMeButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={tourCompleted ? 'Restart tour' : 'Start guided tour'}
      className="relative p-2.5 rounded-lg transition-all hover:bg-gray-100"
      style={{ color: '#C9A35A' }}
    >
      <HelpCircle className="w-5 h-5" />
      {!tourCompleted && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-lg border-2"
          style={{ borderColor: '#C9A35A', opacity: 0.3 }}
        />
      )}
    </motion.button>
  );
}
