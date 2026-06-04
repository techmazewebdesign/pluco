'use client';

import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { useLeadOperations } from '@/lib/hooks/useLeadOperations';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const SAMPLE_CSV = `fullName,email,phone,country,serviceInterest,estimatedBudget,urgency,companyName,sourceChannel
John Patel,john@example.com,+91-98765-43210,India,Second Passport,\$500K,Immediate,TechStart India,LinkedIn
Sarah Johnson,sarah@example.com,+1-555-000-0000,USA,EU Residency,\$200K,This Month,Self-employed,Referral
Lisa Mueller,lisa@example.com,+49-30-123456,Germany,Business Setup,\$100K,Medium,EU Consulting,Google
Michael Chen,michael@example.com,+65-6123-4567,Singapore,Investment,\$1M+,Immediate,Asia Holdings,Email`;

export default function ImportCSVModal({ isOpen, onClose, onImportComplete }: ImportCSVModalProps) {
  const { importLeadsFromCSV } = useLeadOperations();
  const [csvContent, setCSVContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCSVContent(content);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCSVContent(e.target.value);
  };

  const handleImport = async () => {
    if (!csvContent.trim()) {
      alert('Please provide CSV content');
      return;
    }

    try {
      setIsImporting(true);
      const result = await importLeadsFromCSV(csvContent);
      setResults(result);

      if (result.success > 0) {
        alert(`✅ Successfully imported ${result.success} leads!${result.failed > 0 ? ` (${result.failed} failed)` : ''}`);
        if (result.errors.length > 0) {
          console.error('Import errors:', result.errors);
        }
        onImportComplete();
        setTimeout(() => {
          setCSVContent('');
          setResults(null);
          onClose();
        }, 2000);
      } else {
        alert(`❌ Failed to import leads.\n\nErrors:\n${result.errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error importing CSV');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-leads.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>
            📥 Import Leads from CSV
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5" style={{ color: '#5E6470' }} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Instructions */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
            <p className="text-xs font-semibold" style={{ color: '#1E40AF' }}>
              📋 Required Columns (case-insensitive):
            </p>
            <p className="text-xs mt-2" style={{ color: '#1E2430' }}>
              fullName, email, phone, country, serviceInterest, estimatedBudget, urgency, companyName, sourceChannel
            </p>
          </div>

          {/* Sample Download */}
          <button
            onClick={downloadSample}
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
          >
            <Download className="w-4 h-4" />
            Download Sample CSV
          </button>

          {/* Upload or Paste */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>
              Upload CSV File or Paste Content:
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <textarea
              value={csvContent}
              onChange={handlePaste}
              placeholder="Or paste CSV content here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#C9A35A] resize-none"
              rows={8}
            />
          </div>

          {/* Preview */}
          {csvContent && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                📊 Preview ({csvContent.split('\n').length - 1} rows):
              </p>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 overflow-x-auto text-xs font-mono" style={{ color: '#1E2430' }}>
                {csvContent.split('\n').slice(0, 5).map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
                {csvContent.split('\n').length > 5 && <div className="text-gray-500">... ({csvContent.split('\n').length - 5} more rows)</div>}
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: results.success > 0 ? '#DCFCE7' : '#FEE2E2' }}>
              <p className="text-sm font-bold" style={{ color: results.success > 0 ? '#15803D' : '#DC2626' }}>
                {results.success > 0 ? '✅ Import Complete' : '❌ Import Failed'}
              </p>
              <p className="text-xs mt-1" style={{ color: results.success > 0 ? '#15803D' : '#DC2626' }}>
                Success: {results.success} | Failed: {results.failed}
              </p>
              {results.errors.length > 0 && (
                <div className="text-xs mt-2" style={{ color: results.success > 0 ? '#15803D' : '#DC2626' }}>
                  {results.errors.slice(0, 3).map((err: string, i: number) => (
                    <div key={i}>• {err}</div>
                  ))}
                  {results.errors.length > 3 && <div>... and {results.errors.length - 3} more errors</div>}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
              style={{ color: '#5E6470' }}
            >
              Close
            </button>
            <button
              onClick={handleImport}
              disabled={!csvContent.trim() || isImporting}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
              style={{ backgroundColor: isImporting || !csvContent.trim() ? '#CBD5E0' : '#C9A35A', color: '#071C3C' }}
            >
              {isImporting ? '⏳ Importing...' : '📥 Import Leads'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
