'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { TourHighlightRect } from '@/lib/types/dashboardTour';

interface TourOverlayProps {
  isActive: boolean;
  selector: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlightPadding?: number;
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onFinish: () => void;
  onRestart: () => void;
}

export default function TourOverlay({
  isActive,
  selector,
  title,
  description,
  position = 'bottom',
  highlightPadding = 8,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onNext,
  onPrev,
  onExit,
  onFinish,
  onRestart,
}: TourOverlayProps) {
  const [highlightRect, setHighlightRect] = useState<TourHighlightRect | null>(null);
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isActive || !selector) return;

    const updateHighlight = () => {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`Tour element not found: ${selector}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      const highlightData = {
        top: rect.top + scrollTop - highlightPadding,
        left: rect.left + scrollLeft - highlightPadding,
        width: rect.width + highlightPadding * 2,
        height: rect.height + highlightPadding * 2,
      };

      setHighlightRect(highlightData);

      // Calculate card position
      let cardTop = highlightData.top;
      let cardLeft = highlightData.left;

      if (position === 'bottom') {
        cardTop = highlightData.top + highlightData.height + 20;
      } else if (position === 'top') {
        cardTop = highlightData.top - 20;
      } else if (position === 'right') {
        cardLeft = highlightData.left + highlightData.width + 20;
        cardTop = highlightData.top;
      } else if (position === 'left') {
        cardLeft = highlightData.left - 400;
        cardTop = highlightData.top;
      }

      setCardPosition({
        top: Math.max(10, cardTop),
        left: Math.max(10, Math.min(cardLeft, window.innerWidth - 320)),
      });
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [isActive, selector, position, highlightPadding]);

  if (!isActive || !highlightRect) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
      >
        {/* SVG for highlight box */}
        <svg
          ref={svgRef}
          className="fixed inset-0 w-full h-full"
          style={{ pointerEvents: 'auto' }}
          onClick={onExit}
        >
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={highlightRect.left}
                y={highlightRect.top}
                width={highlightRect.width}
                height={highlightRect.height}
                fill="black"
                rx="8"
              />
            </mask>
          </defs>
          {/* Dimmed overlay */}
          <rect
            width="100%"
            height="100%"
            fill="black"
            opacity="0.6"
            mask="url(#tour-mask)"
          />
          {/* Highlight border */}
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={highlightRect.left}
            y={highlightRect.top}
            width={highlightRect.width}
            height={highlightRect.height}
            fill="none"
            stroke="#C9A35A"
            strokeWidth="2"
            rx="8"
            strokeDasharray="6 3"
            strokeDashoffset={0}
            style={{
              animation: 'dash 20s linear infinite',
            }}
          />
        </svg>

        {/* Tour card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bg-white rounded-lg shadow-2xl p-6 max-w-sm border border-gray-200 pointer-events-auto"
          style={{
            top: `${cardPosition.top}px`,
            left: `${cardPosition.left}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#071C3C' }}>
                {title}
              </h3>
              <p className="text-xs mt-1" style={{ color: '#C9A35A' }}>
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onExit}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" style={{ color: '#5E6470' }} />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm mb-4" style={{ color: '#5E6470' }}>
            {description}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              className="h-full rounded-full transition-all"
              style={{ backgroundColor: '#C9A35A' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: '#5E6470' }}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {!isLastStep ? (
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg text-white transition-all"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg text-white transition-all"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                Finish Tour
              </button>
            )}

            {isLastStep && (
              <button
                onClick={onRestart}
                className="px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: '#5E6470' }}
              >
                Restart
              </button>
            )}

            <button
              onClick={onExit}
              className="px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: '#5E6470' }}
            >
              Exit
            </button>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
