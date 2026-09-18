import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiClient';
import {
  Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight,
  Download, Plus, RefreshCw, Layers, Calendar, User, MapPin
} from 'lucide-react';
import { CAMPAIGN_DATA, CAMPAIGN_TYPES, REGIONS, OUTLETS } from '../../mock/marketingData';

export const CampaignPerformanceTable = ({ onOpenCreateModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedOutlet, setSelectedOutlet] = useState('All Outlets');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState('revenue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredCampaigns = useMemo(() => {
    return CAMPAIGN_DATA.filter((cmp) => {
      const name = cmp.name || '';
      const manager = cmp.manager || '';
      const id = cmp.id || '';
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(search) ||
        manager.toLowerCase().includes(search) ||
        id.toLowerCase().includes(search);

      const matchesType = selectedType === 'All' || cmp.type === selectedType;
      const matchesRegion = selectedRegion === 'All Regions' || cmp.region === selectedRegion;
      const matchesOutlet = selectedOutlet === 'All Outlets' || cmp.outlet === selectedOutlet;
      const matchesStatus = selectedStatus === 'All' || cmp.status === selectedStatus;

      return matchesSearch && matchesType && matchesRegion && matchesOutlet && matchesStatus;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [searchTerm, selectedType, selectedRegion, selectedOutlet, selectedStatus, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage) || 1;
  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCampaigns.slice(start, start + itemsPerPage);
  }, [filteredCampaigns, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Running':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Paused':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Draft':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Type', 'Budget', 'Spent', 'Revenue', 'ROI', 'Status', 'Leads', 'Conversions', 'CPL', 'Manager'];
    const rows = filteredCampaigns.map(c => [
      c.id, c.name, c.type, c.budget, c.spent, c.revenue, c.roi, c.status, c.leadsGenerated, c.conversions, c.cpl, c.manager
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FranchiseOps_Campaign_Performance_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-5 border border-slate-700/60 shadow-xl space-y-4"
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Multi-Channel Campaign Performance Table
          </h2>
          <p className="text-xs text-slate-400">Track active spends, attribution, ROI multiples, and conversions across franchise outlets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Launch New Campaign
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Campaign Type */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Campaign Types</option>
          {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Region */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        {/* Outlet */}
        <select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          {OUTLETS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Statuses</option>
          <option value="Running">Running</option>
          <option value="Completed">Completed</option>
          <option value="Paused">Paused</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
              <th className="py-3 px-4">Campaign Info</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3 cursor-pointer hover:text-indigo-400" onClick={() => handleSort('budget')}>
                <div className="flex items-center gap-1">Budget <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-indigo-400" onClick={() => handleSort('spent')}>
                <div className="flex items-center gap-1">Spent <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-indigo-400" onClick={() => handleSort('revenue')}>
                <div className="flex items-center gap-1">Revenue <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-indigo-400" onClick={() => handleSort('roi')}>
                <div className="flex items-center gap-1">ROI <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Leads / Conv.</th>
              <th className="py-3 px-3">CPL</th>
              <th className="py-3 px-4">Manager & Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {paginatedCampaigns.length > 0 ? (
              paginatedCampaigns.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{cmp.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{cmp.id} • {cmp.startDate} to {cmp.endDate}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
                      {cmp.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">₹{(cmp.budget || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">₹{(cmp.spent || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-emerald-400 font-bold">₹{(cmp.revenue || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-extrabold ${cmp.roi >= 5.0 ? 'text-indigo-400' : cmp.roi >= 3.5 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {cmp.roi ? `${cmp.roi}x` : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(cmp.status)}`}>
                      {cmp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <div className="font-semibold">{(cmp.leadsGenerated || 0).toLocaleString()} leads</div>
                    <div className="text-[10px] text-slate-500">{(cmp.conversions || 0).toLocaleString()} conversions</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">
                    {cmp.cpl ? `₹${cmp.cpl}` : 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="flex items-center gap-1 text-slate-200 font-medium"><User className="w-3 h-3 text-indigo-400" /> {cmp.manager}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><MapPin className="w-3 h-3" /> {cmp.outlet}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-500 text-xs">
                  No matching campaigns found. Try adjusting filters or search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div>
          Showing <span className="text-slate-200 font-medium">{Math.min(filteredCampaigns.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
          <span className="text-slate-200 font-medium">{Math.min(filteredCampaigns.length, currentPage * itemsPerPage)}</span> of{' '}
          <span className="text-slate-200 font-medium">{filteredCampaigns.length}</span> campaigns
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 border border-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
