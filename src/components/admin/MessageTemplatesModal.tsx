'use client';

import { useState } from 'react';
import { X, Copy, CheckCircle, Mail, MessageCircle, Briefcase } from 'lucide-react';
import { GeneratedMessages } from '@/lib/hooks/useMessageTemplates';

interface MessageTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: GeneratedMessages | null;
  leadName: string;
  onMarkSent: () => void;
}

export default function MessageTemplatesModal({
  isOpen,
  onClose,
  messages,
  leadName,
  onMarkSent
}: MessageTemplatesModalProps) {
  const [copiedType, setCopiedType] = useState<'email' | 'whatsapp' | 'linkedin' | null>(null);
  const [isMarking, setIsMarking] = useState(false);

  if (!isOpen || !messages) return null;

  const copyToClipboard = async (text: string, type: 'email' | 'whatsapp' | 'linkedin') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleMarkSent = async () => {
    try {
      setIsMarking(true);
      onMarkSent();
      alert('✅ Message marked as sent!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error marking message as sent');
    } finally {
      setIsMarking(false);
    }
  };

  const MessageCard = ({ icon: Icon, title, content, type }: { icon: any; title: string; content: string; type: 'email' | 'whatsapp' | 'linkedin' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5" style={{ color: '#C9A35A' }} />
        <h3 className="font-bold" style={{ color: '#1E2430' }}>
          {title}
        </h3>
      </div>

      <div
        className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[200px] max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap"
        style={{ color: '#1E2430', fontFamily: 'monospace' }}
      >
        {content}
      </div>

      <button
        onClick={() => copyToClipboard(content, type)}
        className="w-full px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        style={{
          backgroundColor: copiedType === type ? '#DCFCE7' : '#F3F4F6',
          color: copiedType === type ? '#15803D' : '#5E6470'
        }}
      >
        {copiedType === type ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Message
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>
            📧 Message Templates for {leadName}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5" style={{ color: '#5E6470' }} />
          </button>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#DBEAFE' }}>
            <p className="text-xs font-semibold" style={{ color: '#1E40AF' }}>
              ℹ️ All messages are compliance-safe and suitable for sending immediately.
            </p>
            <p className="text-xs mt-2" style={{ color: '#1E2430' }}>
              Copy the message you'd like to send and paste it into your chosen platform.
            </p>
          </div>

          {/* Email Template */}
          <MessageCard
            icon={Mail}
            title="Email Message"
            content={messages.email}
            type="email"
          />

          {/* WhatsApp Template */}
          <MessageCard
            icon={MessageCircle}
            title="WhatsApp Message"
            content={messages.whatsapp}
            type="whatsapp"
          />

          {/* LinkedIn Template */}
          <MessageCard
            icon={Briefcase}
            title="LinkedIn Message"
            content={messages.linkedin}
            type="linkedin"
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
              style={{ color: '#5E6470' }}
            >
              Close
            </button>
            <button
              onClick={handleMarkSent}
              disabled={isMarking}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
              style={{ backgroundColor: isMarking ? '#CBD5E0' : '#C9A35A', color: '#071C3C' }}
            >
              {isMarking ? '⏳ Marking...' : '✅ Mark Message Sent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
