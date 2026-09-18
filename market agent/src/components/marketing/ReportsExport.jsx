import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle2, Sparkles, Printer } from 'lucide-react';
import { CAMPAIGN_DATA } from '../../mock/marketingData';

export const ReportsExport = () => {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [reportType, setReportType] = useState('Campaign Report');

  const handleDownload = (format) => {
    setDownloadingFormat(format);

    setTimeout(() => {
      if (format === 'CSV') {
        const headers = ['ID', 'Name', 'Type', 'Budget', 'Spent', 'Revenue', 'ROI', 'Status'];
        const rows = CAMPAIGN_DATA.map(c => [c.id, c.name, c.type, c.budget, c.spent, c.revenue, c.roi, c.status]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `FranchiseOps_${reportType.replace(/\s+/g, '_')}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Simulated PDF / Excel download trigger
        const blob = new Blob([`FranchiseOps AI Enterprise Report: ${reportType}\nGenerated: ${new Date().toLocaleString()}\nFormat: ${format}`], { type: 'text/plain' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `FranchiseOps_${reportType.replace(/\s+/g, '_')}.${format.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.click();
      }

      setDownloadingFormat(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" /> Executive Marketing Report Suite & Export Engine
        </h2>
        <p className="text-xs text-slate-400">Generate board-ready executive summaries, campaign ROI audits, and financial attribution breakdowns.</p>
      </div>

      {/* Main Container */}
      <div className="glass-card rounded-xl p-6 border border-slate-700/60 space-y-6">
        {/* Step 1: Select Report Type */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Select Audit Report Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              'Campaign Performance Report',
              'Marketing ROI & Financial Report',
              'Customer Segmentation Report',
              'Social Media Reach Report',
              'Revenue Attribution Audit'
            ].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`p-3.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                  reportType === type
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 mb-2 text-indigo-400" />
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Export Buttons */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. Choose Export Format</h3>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleDownload('PDF')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4" /> {downloadingFormat === 'PDF' ? 'Generating PDF...' : 'Download PDF Audit'}
            </button>

            <button
              onClick={() => handleDownload('EXCEL')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" /> {downloadingFormat === 'EXCEL' ? 'Building Excel Sheet...' : 'Export Excel (.xlsx)'}
            </button>

            <button
              onClick={() => handleDownload('CSV')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <FileCode className="w-4 h-4" /> {downloadingFormat === 'CSV' ? 'Exporting CSV...' : 'Export Raw CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
