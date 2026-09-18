import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../api/apiClient";
import {
  LineChart, Line, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Plus,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  ShieldAlert,
  UserPlus,
  RefreshCw,
  FileText,
  Building2,
  Phone,
  Mail,
  X,
  ChevronRight,
  UserCheck,
  UserX,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  Flame,
  Star
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* MOCK DATA: STAFF & SWIFT LEAVES                                    */
/* ------------------------------------------------------------------ */

const initialStaff = [
  { id: 1, name: "Priya Sharma", role: "Store Manager", outlet: "Indiranagar Central", status: "On Shift", shift: "Morning (07:00-15:00)", phone: "+91 98765 43210", rating: 4.9, salesPerHour: "₹4,850", attendance: 98, leavesTaken: 3, avatar: "PS", badge: "Top Leader", skills: ["Inventory", "POS", "Shift Planning"] },
  { id: 2, name: "Rahul Verma", role: "Head Barista", outlet: "Connaught Place", status: "On Shift", shift: "Morning (07:00-15:00)", phone: "+91 98765 43211", rating: 4.8, salesPerHour: "₹4,200", attendance: 95, leavesTaken: 5, avatar: "RV", badge: "Coffee Master", skills: ["Latte Art", "Espresso Ops", "Trainings"] },
  { id: 3, name: "Ananya Sen", role: "Shift Supervisor", outlet: "Salt Lake Sector V", status: "On Leave", shift: "Off Duty", phone: "+91 98765 43212", rating: 4.7, salesPerHour: "₹3,900", attendance: 92, leavesTaken: 8, avatar: "AS", badge: "Operations Pro", skills: ["Cash Register", "Safety Audit"] },
  { id: 4, name: "Vikram Patel", role: "Kitchen Lead", outlet: "Viman Nagar", status: "On Shift", shift: "Evening (15:00-23:00)", phone: "+91 98765 43213", rating: 4.6, salesPerHour: "₹3,600", attendance: 91, leavesTaken: 4, avatar: "VP", badge: "Speed Chef", skills: ["Grill", "Inventory", "HACCP"] },
  { id: 5, name: "Sneha Reddy", role: "Billing Executive", outlet: "Banjara Hills", status: "On Shift", shift: "Morning (07:00-15:00)", phone: "+91 98765 43214", rating: 4.85, salesPerHour: "₹5,100", attendance: 99, leavesTaken: 2, avatar: "SR", badge: "Accuracy Ace", skills: ["Billing", "Customer Delight"] },
  { id: 6, name: "Karan Johar", role: "Service Assistant", outlet: "Madurai Junction", status: "Off Duty", shift: "Night (23:00-07:00)", phone: "+91 98765 43215", rating: 4.4, salesPerHour: "₹2,800", attendance: 88, leavesTaken: 9, avatar: "KJ", badge: "Hard Worker", skills: ["Floor Management"] },
  { id: 7, name: "Meera Nair", role: "Barista", outlet: "Koramangala 5th Block", status: "On Shift", shift: "Evening (15:00-23:00)", phone: "+91 98765 43216", rating: 4.75, salesPerHour: "₹3,850", attendance: 96, leavesTaken: 4, avatar: "MN", badge: "Customer Favorite", skills: ["Customer Service", "Beverage Prep"] },
  { id: 8, name: "Arjun Gupta", role: "Store Manager", outlet: "Juhu Beachfront", status: "On Shift", shift: "Morning (07:00-15:00)", phone: "+91 98765 43217", rating: 4.9, salesPerHour: "₹5,400", attendance: 97, leavesTaken: 3, avatar: "AG", badge: "Revenue Champion", skills: ["P&L", "Staffing", "Vendor Mgmt"] },
];

const initialSwiftLeaves = [
  { id: "LV-2041", applicant: "Ananya Sen", role: "Shift Supervisor", outlet: "Salt Lake Sector V", leaveType: "Emergency Medical", startDate: "2026-08-08", endDate: "2026-08-09", totalDays: 2, reason: "Sudden high fever & viral infection", status: "Pending AI Approval", priority: "Urgent", aiConflict: "High Impact — Weekend evening shift supervisor missing", replacementSuggested: "Rahul Roy (Off Duty, 96% Match)", appliedAt: "10 mins ago" },
  { id: "LV-2042", applicant: "Karan Johar", role: "Service Assistant", outlet: "Madurai Junction", leaveType: "Shift Swap", startDate: "2026-08-10", endDate: "2026-08-10", totalDays: 1, reason: "Swapping night shift with Suresh M", status: "Swift Approved", priority: "Normal", aiConflict: "No Conflict — Suresh M verified available", replacementSuggested: "Suresh M (Agreed Swap)", appliedAt: "1 hr ago" },
  { id: "LV-2043", applicant: "Rohan Das", role: "Billing Executive", outlet: "Indiranagar Central", leaveType: "Casual Leave", startDate: "2026-08-12", endDate: "2026-08-13", totalDays: 2, reason: "Family event in native town", status: "Pending AI Approval", priority: "Normal", aiConflict: "Low Impact — 3 billing staff available on duty", replacementSuggested: "Auto-covered by Sneha R", appliedAt: "3 hrs ago" },
  { id: "LV-2044", applicant: "Deepa Malviya", role: "Barista", outlet: "Connaught Place", leaveType: "Sick Leave", startDate: "2026-08-07", endDate: "2026-08-07", totalDays: 1, reason: "Doctor appointment & migraines", status: "Approved", priority: "High", aiConflict: "Covered — Shift reassigned to Priya S", replacementSuggested: "Priya S (Shift Shifted)", appliedAt: "Yesterday" },
  { id: "LV-2045", applicant: "Suresh Menon", role: "Kitchen Assistant", outlet: "Viman Nagar", leaveType: "Earned Leave", startDate: "2026-08-15", endDate: "2026-08-18", totalDays: 4, reason: "Independence day long weekend vacation", status: "Rejected", priority: "Normal", aiConflict: "Critical Conflict — Peak footfall day, maximum 1 leave allowed per store", replacementSuggested: "N/A (Peak Period Restriction)", appliedAt: "2 days ago" },
];

const shiftRoster = [
  { outlet: "Indiranagar Central", morning: ["Priya Sharma", "Rohan Das", "Kavita S"], evening: ["Meera Nair", "Amit K"], night: ["Ramesh P"], coverageScore: 98, status: "Fully Staffed" },
  { outlet: "Connaught Place", morning: ["Rahul Verma", "Deepa M"], evening: ["Siddharth B", "Tarun G"], night: ["Deepak K"], coverageScore: 84, status: "Understaffed Evening" },
  { outlet: "Salt Lake Sector V", morning: ["Ananya Sen (Leave)", "Bikram D"], evening: ["Rajesh V"], night: ["Subhash CH"], coverageScore: 72, status: "Critical Shortage" },
  { outlet: "Viman Nagar", morning: ["Vikram Patel", "Suresh Menon"], evening: ["Pooja N", "Harish R"], night: ["Nitin B"], coverageScore: 94, status: "Optimal" },
];

const attendanceTrends = [
  { day: "Mon", attendance: 96, lateArrivals: 3, overtimeHours: 14 },
  { day: "Tue", attendance: 94, lateArrivals: 5, overtimeHours: 18 },
  { day: "Wed", attendance: 98, lateArrivals: 1, overtimeHours: 12 },
  { day: "Thu", attendance: 95, lateArrivals: 4, overtimeHours: 20 },
  { day: "Fri", attendance: 92, lateArrivals: 7, overtimeHours: 32 },
  { day: "Sat", attendance: 97, lateArrivals: 2, overtimeHours: 45 },
  { day: "Sun", attendance: 99, lateArrivals: 1, overtimeHours: 50 },
];

const leaveTypeDistribution = [
  { name: "Emergency / Sick", value: 38, color: "#f43f5e" },
  { name: "Swift Shift Swaps", value: 28, color: "#3b82f6" },
  { name: "Casual Leaves", value: 22, color: "#f59e0b" },
  { name: "Earned / Annual", value: 12, color: "#10b981" },
];

const outletStaffingData = [
  { name: "Indiranagar", Required: 12, Assigned: 12 },
  { name: "Connaught Pl", Required: 15, Assigned: 13 },
  { name: "Salt Lake V", Required: 10, Assigned: 8 },
  { name: "Viman Nagar", Required: 11, Assigned: 11 },
  { name: "Banjara Hills", Required: 9, Assigned: 9 },
  { name: "Madurai Jct", Required: 8, Assigned: 7 },
];

const aiWorkforceInsights = [
  { id: 1, type: "urgent", icon: ShieldAlert, title: "Urgent Shift Gap: Salt Lake Sector V", detail: "Ananya Sen's medical leave leaves Saturday evening supervisor slot empty. AI suggests auto-assigning Rahul Roy (Off-Duty, +15% overtime pay).", action: "Auto-Deploy Replacement" },
  { id: 2, type: "optimization", icon: Sparkles, title: "Peak Footfall Shift Rebalance", detail: "Connaught Place footfall surges 35% between 5 PM - 8 PM on Fridays. Recommend shifting 1 morning cashier to evening peak shift.", action: "Apply Shift Rebalance" },
  { id: 3, type: "reward", icon: Award, title: "Swift Attendance Recognition", titleExtra: "Sneha Reddy & Priya Sharma", detail: "Zero late arrivals and 98%+ shift compliance for 90 days straight. Recommended for quarterly bonus & badge.", action: "Grant Performance Badge" },
];

export default function StaffAgent() {
  const [activeSection, setActiveSection] = useState("overview");
  const [staffList, setStaffList] = useState(initialStaff);
  const [swiftLeaves, setSwiftLeaves] = useState(initialSwiftLeaves);

  useEffect(() => {
    async function loadStaffData() {
      try {
        const staffRes = await apiFetch("/staff");
        if (staffRes.success && Array.isArray(staffRes.data) && staffRes.data.length > 0) {
          const mappedStaff = staffRes.data.map(item => ({
            id: item.staff_id,
            name: item.staff_name || `${item.first_name || ""} ${item.last_name || ""}`.trim(),
            role: item.role || "Staff Member",
            outlet: item.outlet?.outlet_name || "Flagship Outlet",
            status: item.status || "On Shift",
            shift: item.shift || "Morning (07:00-15:00)",
            phone: item.phone || "+91 98765 00000",
            rating: Number(item.rating || 4.5),
            salesPerHour: item.sales_per_hour ? `₹${item.sales_per_hour}` : "₹2,500",
            attendance: item.attendance || 95,
            leavesTaken: item.leaves_taken || 0,
            avatar: (item.staff_name || "S").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
            skills: ["POS", "Customer Service"]
          }));
          setStaffList(mappedStaff);
        }

        const leavesRes = await apiFetch("/staff/leaves");
        if (leavesRes.success && Array.isArray(leavesRes.data) && leavesRes.data.length > 0) {
          const mappedLeaves = leavesRes.data.map(leave => ({
            id: leave.leave_id,
            code: leave.leave_code,
            applicant: leave.applicant?.staff_name || `Staff #${leave.applicant_id}`,
            applicantRole: leave.applicant?.role || "Staff",
            outlet: leave.outlet?.outlet_name || "Flagship Outlet",
            leaveType: leave.leave_type,
            startDate: leave.start_date ? String(leave.start_date).split("T")[0] : "2026-08-20",
            endDate: leave.end_date ? String(leave.end_date).split("T")[0] : "2026-08-21",
            totalDays: leave.total_days || 1,
            reason: leave.reason,
            status: leave.status,
            priority: leave.priority || "Normal",
            aiConflict: leave.ai_conflict,
            replacementSuggested: leave.replacement_suggested
          }));
          setSwiftLeaves(mappedLeaves);
        }
      } catch (err) {
        // preserve initial demo fallback on error
      }
    }
    loadStaffData();
  }, []);

  const [leaveFilter, setLeaveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [outletFilter, setOutletFilter] = useState("all");
  
  // Modals state
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // New leave form state
  const [newLeave, setNewLeave] = useState({
    applicant: "Priya Sharma",
    leaveType: "Emergency Medical",
    startDate: "2026-08-10",
    endDate: "2026-08-11",
    reason: "Medical checkup & minor procedure",
    priority: "Normal"
  });

  // Filtered Swift Leaves
  const filteredLeaves = useMemo(() => {
    return swiftLeaves.filter(leave => {
      const matchesFilter =
        leaveFilter === "all" ? true :
        leaveFilter === "pending" ? leave.status.includes("Pending") :
        leaveFilter === "approved" ? leave.status.includes("Approved") :
        leaveFilter === "rejected" ? leave.status === "Rejected" :
        leaveFilter === "urgent" ? leave.priority === "Urgent" : true;

      const matchesSearch =
        leave.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.outlet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [swiftLeaves, leaveFilter, searchQuery]);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchesOutlet = outletFilter === "all" ? true : s.outlet === outletFilter;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.outlet.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOutlet && matchesSearch;
    });
  }, [staffList, outletFilter, searchQuery]);

  // Handlers for Swift Leave approvals
  const handleApproveLeave = (id) => {
    setSwiftLeaves(prev =>
      prev.map(l => l.id === id ? { ...l, status: "Swift Approved", aiConflict: "Resolved & Shift Reassigned" } : l)
    );
  };

  const handleRejectLeave = (id) => {
    setSwiftLeaves(prev =>
      prev.map(l => l.id === id ? { ...l, status: "Rejected", aiConflict: "Declined by Manager" } : l)
    );
  };

  const handleCreateLeaveSubmit = (e) => {
    e.preventDefault();
    const createdLeave = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      applicant: newLeave.applicant,
      role: staffList.find(s => s.name === newLeave.applicant)?.role || "Staff Member",
      outlet: staffList.find(s => s.name === newLeave.applicant)?.outlet || "Indiranagar Central",
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      totalDays: 1,
      reason: newLeave.reason,
      status: "Pending AI Approval",
      priority: newLeave.priority,
      aiConflict: "AI Analyzing Roster Impact...",
      replacementSuggested: "Auto-searching off-duty staff",
      appliedAt: "Just now"
    };

    setSwiftLeaves([createdLeave, ...swiftLeaves]);
    setIsApplyLeaveOpen(false);
  };

  const sections = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "swift_leaves", label: "Swift Leaves Engine", icon: Zap, count: swiftLeaves.filter(l => l.status.includes("Pending")).length },
    { id: "shift_roster", label: "Shift Roster & Swaps", icon: CalendarDays },
    { id: "attendance", label: "Attendance & Time Tracking", icon: Clock },
    { id: "performance", label: "Staff Performance & KPIs", icon: Award },
    { id: "insights", label: "AI Workforce Insights", icon: Sparkles },
    { id: "directory", label: "Staff Directory", icon: Building2 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* ============ TOP HEADER BANNER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Users className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Staff Agent
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Swift Engine Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Autonomous shift roster optimization, swift leave approvals, replacement matching & workforce analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Apply Swift Leave
          </button>

          <button
            onClick={() => setIsAssignShiftOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
          >
            <CalendarDays className="w-4 h-4 text-blue-500" /> Auto-Schedule Roster
          </button>
        </div>
      </div>

      {/* ============ NAVIGATION TABS ============ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/50 dark:border-slate-800/60">
        {sections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                  : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800"
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              {sec.label}
              {sec.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white text-blue-600" : "bg-rose-500 text-white animate-pulse"
                }`}>
                  {sec.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============ SECTION 1: OVERVIEW KPI GRID ============ */}
      {(activeSection === "overview" || activeSection === "all") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Total Active Staff</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">148</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" /> +6 new this month
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>On-Duty Today</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">112</div>
            <div className="text-[11px] text-slate-400 mt-1">94.2% shift compliance</div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-xl shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Pending Swift Leaves</span>
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
              {swiftLeaves.filter(l => l.status.includes("Pending")).length}
            </div>
            <div className="text-[11px] text-amber-500 font-medium mt-1">Needs AI/Manager action</div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Shift Coverage Rate</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">96.5%</div>
            <div className="text-[11px] text-emerald-500 font-semibold mt-1">+1.8% vs last week</div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Avg Productivity</span>
              <Award className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">88.4%</div>
            <div className="text-[11px] text-purple-500 font-semibold mt-1">Top Outlet: Indiranagar</div>
          </div>
        </div>
      )}

      {/* ============ SECTION 2: SWIFT LEAVES ENGINE ============ */}
      {(activeSection === "overview" || activeSection === "swift_leaves" || activeSection === "all") && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 p-5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    Swift Leaves Engine — Instant AI Leave & Shift Replacement
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                    When employees request emergency leave or shift swaps, the Swift Engine calculates outlet footfall risks, auto-finds off-duty replacement staff, and provides instant 1-click approvals.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 whitespace-nowrap self-start md:self-auto"
              >
                Submit Swift Request
              </button>
            </div>
          </div>

          {/* FILTER AND SEARCH CONTROLS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {["all", "pending", "approved", "rejected", "urgent"].map(f => (
                <button
                  key={f}
                  onClick={() => setLeaveFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all ${
                    leaveFilter === f
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {f === "pending" ? "Pending AI" : f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, outlet, leave type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-transparent focus:border-blue-500 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* LEAVE CARDS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeaves.map((leave) => {
              const isPending = leave.status.includes("Pending");
              const isApproved = leave.status.includes("Approved");
              const isRejected = leave.status === "Rejected";

              return (
                <motion.div
                  key={leave.id}
                  layout
                  className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all relative ${
                    leave.priority === "Urgent"
                      ? "border-amber-300 dark:border-amber-500/30"
                      : "border-slate-200/80 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                        {leave.applicant.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{leave.applicant}</h3>
                          <span className="text-[11px] text-slate-400">({leave.role})</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" /> {leave.outlet}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isPending ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
                      isApproved ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" :
                      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                    }`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Leave Type & Dates</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {leave.leaveType} • ({leave.totalDays} day)
                      </span>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {leave.startDate} to {leave.endDate}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Reason</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                        "{leave.reason}"
                      </span>
                    </div>
                  </div>

                  {/* AI CONFLICT & REPLACEMENT SUGGESTION */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Swift Analysis:
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">{leave.aiConflict}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 font-medium">
                      Suggested Cover: <span className="text-indigo-600 dark:text-indigo-400">{leave.replacementSuggested}</span>
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  {isPending && (
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => handleApproveLeave(leave.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Swift Approve
                      </button>
                      <button
                        onClick={() => handleRejectLeave(leave.id)}
                        className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ SECTION 3: SHIFT ROSTER & SWAPS ============ */}
      {(activeSection === "overview" || activeSection === "shift_roster" || activeSection === "all") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Outlet Shift Roster & Live Swaps</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Current active shifts and coverage scores across outlets.</p>
            </div>
            <button
              onClick={() => setIsAssignShiftOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <CalendarDays className="w-3.5 h-3.5" /> Manage Roster
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shiftRoster.map((roster) => (
              <div key={roster.outlet} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{roster.outlet}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    roster.coverageScore >= 90 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                    roster.coverageScore >= 80 ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                  }`}>
                    {roster.coverageScore}% Coverage
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Morning (07:00-15:00):</span>
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {roster.morning.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] text-slate-800 dark:text-slate-200">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Evening (15:00-23:00):</span>
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {roster.evening.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] text-slate-800 dark:text-slate-200">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Night (23:00-07:00):</span>
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {roster.night.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] text-slate-800 dark:text-slate-200">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ SECTION 4: ATTENDANCE & TIME TRACKING ============ */}
      {(activeSection === "overview" || activeSection === "attendance" || activeSection === "all") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Weekly Attendance & Overtime Trends</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Shift check-in compliance vs overtime hours accumulated.</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrends} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="overtimeHours" name="Overtime (Hours)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Leave Breakdown</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of shift leave types.</p>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie data={leaveTypeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {leaveTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                </RPieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {leaveTypeDistribution.map(l => (
                <div key={l.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-slate-700 dark:text-slate-300">{l.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{l.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ SECTION 5: AI WORKFORCE INSIGHTS ============ */}
      {(activeSection === "overview" || activeSection === "insights" || activeSection === "all") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">AI Workforce Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiWorkforceInsights.map((insight) => {
              const IconComp = insight.icon;
              return (
                <div key={insight.id} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      <IconComp className="w-4 h-4" />
                      <span>{insight.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {insight.detail}
                    </p>
                  </div>
                  <button className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all">
                    {insight.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ SECTION 6: STAFF DIRECTORY ============ */}
      {(activeSection === "overview" || activeSection === "directory" || activeSection === "all") && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Staff Member Directory</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage franchise employees, roles, and leave histories.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={outletFilter}
                onChange={e => setOutletFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="all">All Outlets</option>
                <option value="Indiranagar Central">Indiranagar Central</option>
                <option value="Connaught Place">Connaught Place</option>
                <option value="Salt Lake Sector V">Salt Lake Sector V</option>
                <option value="Viman Nagar">Viman Nagar</option>
                <option value="Banjara Hills">Banjara Hills</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xs hover:border-blue-500/50 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {staff.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{staff.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{staff.role}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                      {staff.badge}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Outlet:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.outlet}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Status:</span>
                    <span className={`font-semibold ${
                      staff.status === "On Shift" ? "text-emerald-500" :
                      staff.status === "On Leave" ? "text-amber-500" : "text-slate-400"
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Sales/Hr:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.salesPerHour}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ APPLY SWIFT LEAVE MODAL ============ */}
      <AnimatePresence>
        {isApplyLeaveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Swift Leave</h3>
                </div>
                <button onClick={() => setIsApplyLeaveOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLeaveSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Employee Name</label>
                  <select
                    value={newLeave.applicant}
                    onChange={e => setNewLeave({ ...newLeave, applicant: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 text-slate-800 dark:text-slate-100 outline-none"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.outlet})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Leave Type</label>
                  <select
                    value={newLeave.leaveType}
                    onChange={e => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="Emergency Medical">Emergency Medical</option>
                    <option value="Shift Swap">Shift Swap</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newLeave.startDate}
                      onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">End Date</label>
                    <input
                      type="date"
                      value={newLeave.endDate}
                      onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Reason / Notes</label>
                  <textarea
                    rows={3}
                    value={newLeave.reason}
                    onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}
                    placeholder="Provide details for swift AI verification..."
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Instant Swift Preview:
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    AI will auto-match an off-duty staff replacement in under 5 seconds upon submission.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                  >
                    Request Swift Approval
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsApplyLeaveOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============ STAFF DETAIL MODAL ============ */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                    {selectedStaff.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{selectedStaff.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedStaff.role} • {selectedStaff.outlet}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[11px] block">Current Shift</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaff.shift}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[11px] block">Customer Rating</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedStaff.rating} / 5.0
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[11px] block">Attendance Compliance</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaff.attendance}%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[11px] block">Leaves Taken</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaff.leavesTaken} days</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">Skills & Certifications</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedStaff.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${selectedStaff.phone}`}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Employee
                </a>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
