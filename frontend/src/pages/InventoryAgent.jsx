import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../api/apiClient";
import {
  LineChart, Line, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  PackageX,
  Clock3,
  HeartPulse,
  Search,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  FileDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ShoppingCart,
  Layers,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  TrendingUp,
  Flame,
  PackageSearch,
  Building2,
  CalendarDays,
  ShieldAlert,
  Send,
  PlusCircle,
  Edit3,
  FileText
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* MOCK INVENTORY DATA                                                */
/* ------------------------------------------------------------------ */

const initialProducts = [
  { id: 1, name: "Premium Paneer Slices 1kg", sku: "SKU-PN-101", category: "Dairy & Cheese", currentStock: 18, reorderLevel: 50, supplier: "FreshDairy Co", batchNo: "B-2026-88", expiryDate: "2026-08-04", status: "Low Stock" },
  { id: 2, name: "Cold Coffee Brew Concentrate 5L", sku: "SKU-BV-204", category: "Beverages", currentStock: 140, reorderLevel: 40, supplier: "Supreme Foods", batchNo: "B-2026-12", expiryDate: "2026-09-15", status: "Healthy" },
  { id: 3, name: "Multigrain Burger Buns (Pack of 12)", sku: "SKU-BK-309", category: "Bakery", currentStock: 25, reorderLevel: 30, supplier: "Bakers Union", batchNo: "B-2026-90", expiryDate: "2026-08-03", status: "Expiring Soon" },
  { id: 4, name: "Eco Craft Takeaway Containers", sku: "SKU-PK-411", category: "Packaging", currentStock: 0, reorderLevel: 200, supplier: "Packaging Hub", batchNo: "B-2026-05", expiryDate: "2028-12-31", status: "Out of Stock" },
  { id: 5, name: "Smoky BBQ Sauce 2.5kg", sku: "SKU-SP-502", category: "Spices & Sauces", currentStock: 85, reorderLevel: 20, supplier: "Global Spices", batchNo: "B-2026-34", expiryDate: "2026-11-20", status: "Healthy" },
  { id: 6, name: "Mozzarella Cheese Shredded 2kg", sku: "SKU-PN-108", category: "Dairy & Cheese", currentStock: 12, reorderLevel: 45, supplier: "FreshDairy Co", batchNo: "B-2026-89", expiryDate: "2026-08-05", status: "Low Stock" },
  { id: 7, name: "Classic French Fries Frozen 2.5kg", sku: "SKU-FZ-601", category: "Frozen Foods", currentStock: 210, reorderLevel: 60, supplier: "Supreme Foods", batchNo: "B-2026-44", expiryDate: "2027-01-10", status: "Healthy" },
  { id: 8, name: "Almond Milk Barista Edition 1L", sku: "SKU-BV-215", category: "Beverages", currentStock: 5, reorderLevel: 25, supplier: "Supreme Foods", batchNo: "B-2026-82", expiryDate: "2026-08-02", status: "Expiring Soon" },
  { id: 9, name: "Biodegradable Paper Straws 500s", sku: "SKU-PK-420", category: "Packaging", currentStock: 0, reorderLevel: 100, supplier: "Packaging Hub", batchNo: "B-2026-01", expiryDate: "2029-05-30", status: "Out of Stock" },
  { id: 10, name: "Chipotle Mayo Squeeze 1kg", sku: "SKU-SP-511", category: "Spices & Sauces", currentStock: 64, reorderLevel: 15, supplier: "Global Spices", batchNo: "B-2026-40", expiryDate: "2026-10-14", status: "Healthy" },
  { id: 11, name: "Veggie Patty Frozen 50s", sku: "SKU-FZ-608", category: "Frozen Foods", currentStock: 15, reorderLevel: 40, supplier: "Supreme Foods", batchNo: "B-2026-92", expiryDate: "2026-08-06", status: "Low Stock" },
  { id: 12, name: "Matcha Tea Powder 500g", sku: "SKU-BV-222", category: "Beverages", currentStock: 0, reorderLevel: 10, supplier: "Global Spices", batchNo: "B-2026-19", expiryDate: "2026-08-01", status: "Out of Stock" },
  { id: 13, name: "Butter Unsalted 500g Block", sku: "SKU-PN-115", category: "Dairy & Cheese", currentStock: 95, reorderLevel: 30, supplier: "FreshDairy Co", batchNo: "B-2026-77", expiryDate: "2026-09-30", status: "Healthy" },
  { id: 14, name: "Garlic Herb Bread Loaf", sku: "SKU-BK-312", category: "Bakery", currentStock: 8, reorderLevel: 20, supplier: "Bakers Union", batchNo: "B-2026-95", expiryDate: "2026-08-02", status: "Expiring Soon" },
];

/* Category Chart Data */
const categoryChartData = [
  { name: "Dairy & Cheese", value: 35, color: "#3b82f6" },
  { name: "Beverages", value: 25, color: "#8b5cf6" },
  { name: "Frozen Foods", value: 18, color: "#06b6d4" },
  { name: "Spices & Sauces", value: 12, color: "#f59e0b" },
  { name: "Packaging", value: 10, color: "#ec4899" },
];

/* Stock Levels Comparison Data */
const stockLevelsData = [
  { name: "Paneer Slices", Current: 18, Reorder: 50 },
  { name: "Cold Coffee", Current: 140, Reorder: 40 },
  { name: "Burger Buns", Current: 25, Reorder: 30 },
  { name: "BBQ Sauce", Current: 85, Reorder: 20 },
  { name: "Mozzarella", Current: 12, Reorder: 45 },
  { name: "French Fries", Current: 210, Reorder: 60 },
  { name: "Almond Milk", Current: 5, Reorder: 25 },
];

/* Monthly Inventory Trend Data */
const inventoryTrendData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => ({
  month: m,
  Received: Math.round(4200 + Math.sin(i / 2) * 800 + i * 150),
  Consumed: Math.round(3800 + Math.sin(i / 2) * 750 + i * 140),
  Wastage: Math.round(180 - Math.sin(i) * 40),
}));

/* Fast vs Slow Moving Chart Data */
const velocityData = [
  { name: "Cold Coffee Brew", Fast: 450, Slow: 0 },
  { name: "French Fries", Fast: 380, Slow: 0 },
  { name: "Paneer Slices", Fast: 310, Slow: 0 },
  { name: "Matcha Tea Powder", Fast: 0, Slow: 45 },
  { name: "Eco Containers", Fast: 0, Slow: 30 },
  { name: "Almond Milk", Fast: 0, Slow: 22 },
];

export default function InventoryAgent() {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    async function loadInventory() {
      try {
        const res = await apiFetch("/inventory");
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(item => ({
            id: item.inventory_id,
            name: item.product_name,
            sku: item.batch_no || `SKU-${item.inventory_id}`,
            category: item.category || "General",
            currentStock: item.current_stock ?? item.quantity ?? 0,
            reorderLevel: item.reorder_level ?? 20,
            supplier: item.supplier_name || "Supplier",
            batchNo: item.batch_no || "B-2026-01",
            expiryDate: item.expiry_date ? String(item.expiry_date).split("T")[0] : "2026-12-31",
            status: item.status || "Healthy"
          }));
          setProducts(mapped);
        }
      } catch (err) {
        // preserve initial demo fallback on error
      }
    }
    loadInventory();
  }, []);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expiryFilter, setExpiryFilter] = useState("All");
  const [sortKey, setSortKey] = useState("currentStock");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Active Modals
  const [modalType, setModalType] = useState(null); // 'add' | 'update' | 'po' | null
  const [toastMsg, setToastMsg] = useState("");

  // Form states for modals
  const [newProd, setNewProd] = useState({
    name: "", sku: "", category: "Dairy & Cheese", currentStock: "", reorderLevel: "", supplier: "FreshDairy Co", expiryDate: ""
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Filtered Inventory Data
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      const matchSupp = supplierFilter === "All" || p.supplier === supplierFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchExpiry = expiryFilter === "All" || (expiryFilter === "Expiring Soon" ? p.status === "Expiring Soon" : p.status !== "Expiring Soon");
      return matchSearch && matchCat && matchSupp && matchStatus && matchExpiry;
    }).sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      return a[sortKey] > b[sortKey] ? dir : a[sortKey] < b[sortKey] ? -dir : 0;
    });
  }, [products, search, categoryFilter, supplierFilter, statusFilter, expiryFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // Handlers for Modals
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.sku) return;
    const item = {
      id: Date.now(),
      name: newProd.name,
      sku: newProd.sku,
      category: newProd.category,
      currentStock: Number(newProd.currentStock) || 0,
      reorderLevel: Number(newProd.reorderLevel) || 20,
      supplier: newProd.supplier,
      batchNo: `B-2026-${Math.floor(10 + Math.random() * 89)}`,
      expiryDate: newProd.expiryDate || "2026-12-31",
      status: Number(newProd.currentStock) === 0 ? "Out of Stock" : Number(newProd.currentStock) < Number(newProd.reorderLevel) ? "Low Stock" : "Healthy"
    };
    setProducts([item, ...products]);
    setModalType(null);
    setNewProd({ name: "", sku: "", category: "Dairy & Cheese", currentStock: "", reorderLevel: "", supplier: "FreshDairy Co", expiryDate: "" });
    showToast(`Product "${item.name}" added successfully!`);
  };

  const handleExportCSV = () => {
    const headers = ["Product Name,SKU,Category,Current Stock,Reorder Level,Supplier,Batch,Expiry,Status\n"];
    const rows = products.map(p => `${p.name},${p.sku},${p.category},${p.currentStock},${p.reorderLevel},${p.supplier},${p.batchNo},${p.expiryDate},${p.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Franchise_Inventory_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Inventory report downloaded as CSV!");
  };

  return (
    <div className="space-y-6">

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> AI AGENT · INVENTORY INTELLIGENCE
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Boxes className="text-blue-600 dark:text-blue-400" /> Inventory Agent Module
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time stock tracking, automated reorder triggers, AI expiry warnings, and supplier turnover analytics.
          </p>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModalType("add")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/25"
          >
            <Plus size={14} /> Add Product
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModalType("update")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Edit3 size={14} /> Update Stock
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModalType("po")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ShoppingCart size={14} /> Create PO
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileDown size={14} /> Export Report
          </motion.button>
        </div>
      </div>

      {/* KPI CARDS (6 METRICS) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Total Inventory Value", value: "₹48.60L", trend: "+8.4%", up: true, icon: Boxes, color: "#3b82f6", detail: "Across all 16 outlets" },
          { label: "Total Products", value: `${products.length} SKUs`, trend: "+3 new", up: true, icon: Layers, color: "#8b5cf6", detail: "Active catalog items" },
          { label: "Low Stock Items", value: `${products.filter(p => p.status === "Low Stock").length}`, trend: "Needs restock", up: false, icon: AlertTriangle, color: "#f59e0b", detail: "Below reorder threshold" },
          { label: "Out of Stock Items", value: `${products.filter(p => p.status === "Out of Stock").length}`, trend: "Critical action", up: false, icon: PackageX, color: "#f43f5e", detail: "Loss of sales risk" },
          { label: "Expiring Soon", value: `${products.filter(p => p.status === "Expiring Soon").length}`, trend: "< 7 days remaining", up: false, icon: Clock3, color: "#eab308", detail: "Batch clearance needed" },
          { label: "Inventory Health Score", value: "92%", trend: "+3 pts", up: true, icon: HeartPulse, color: "#10b981", detail: "Optimal turnover rate" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-4 flex flex-col shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}1A` }}>
                <kpi.icon size={17} style={{ color: kpi.color }} />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${kpi.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {kpi.trend}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">{kpi.label}</p>
            <p className="text-[10px] text-slate-400 mt-auto pt-2">{kpi.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* AI INSIGHTS & SMART ALERTS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* AI INSIGHTS PANEL */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">AI Inventory Insights & Recommendations</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated neural predictions for stock optimization</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              Score: 92%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "Reorder Trigger: Paneer Slices", detail: "Stock level (18kg) at Koramangala fell below 50kg reorder threshold. Supplier FreshDairy Co lead time is 2 days.", type: "warning", action: "Quick PO" },
              { title: "Inter-Outlet Stock Transfer", detail: "Transfer 50kg Mozzarella from Indiranagar (Overstocked by +80kg) to Koramangala to prevent stockout.", type: "info", action: "Initiate Transfer" },
              { title: "Expiry Risk Warning", detail: "Batch #B-2026-90 (Multigrain Burger Buns) expires in 3 days. Recommend 20% discount on combo meals.", type: "danger", action: "Apply Discount" },
              { title: "Overstock Detected: Bottled Water", detail: "Jaipur outlet holding 90 days of excess inventory for Bottled Water. Pause next order cycle.", type: "success", action: "Pause Orders" },
            ].map((insight, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{insight.title}</span>
                    <span className={`w-2 h-2 rounded-full ${insight.type === "danger" ? "bg-rose-500" : insight.type === "warning" ? "bg-amber-500" : insight.type === "info" ? "bg-blue-500" : "bg-emerald-500"}`} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{insight.detail}</p>
                </div>
                <button
                  onClick={() => showToast(`Executed: ${insight.action}`)}
                  className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start"
                >
                  {insight.action} <ArrowUpRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS SECTION */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm flex flex-col">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Inventory Status Alerts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Color-coded live stock monitors</p>

          <div className="space-y-3 flex-1">
            {[
              { label: "Out of Stock (3 SKUs)", color: "rose", bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20", icon: PackageX, items: "Eco Containers, Paper Straws, Matcha Powder" },
              { label: "Low Stock (3 SKUs)", color: "amber", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20", icon: AlertTriangle, items: "Paneer Slices, Mozzarella, Veggie Patty" },
              { label: "Expiring Soon (3 SKUs)", color: "yellow", bg: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20", icon: Clock3, items: "Burger Buns, Almond Milk, Garlic Bread" },
              { label: "Healthy Stock (5 SKUs)", color: "emerald", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20", icon: PackageCheck, items: "Cold Coffee, BBQ Sauce, French Fries" },
            ].map((alert, i) => (
              <div key={i} className={`p-3 rounded-xl border ${alert.bg} flex items-start gap-3`}>
                <alert.icon size={16} className={`shrink-0 mt-0.5 text-${alert.color}-500`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{alert.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{alert.items}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS GRID (PIE, BAR, LINE, VELOCITY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* CHART 1: INVENTORY BY CATEGORY */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Inventory by Category</h3>
          <p className="text-[11px] text-slate-400 mb-3">Distribution across product lines</p>
          <ResponsiveContainer width="100%" height={180}>
            <RPieChart>
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
              <Pie data={categoryChartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={4}>
                {categoryChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </RPieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-[10px]">
            {categoryChartData.map(c => (
              <span key={c.name} className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* CHART 2: STOCK LEVELS VS REORDER */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Stock Levels vs Reorder Target</h3>
          <p className="text-[11px] text-slate-400 mb-3">Current stock vs target threshold</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stockLevelsData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="Current" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Reorder" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-blue-500" /> Current Stock</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-rose-500" /> Reorder Level</span>
          </div>
        </div>

        {/* CHART 3: MONTHLY INVENTORY TREND */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Monthly Inventory Trend</h3>
          <p className="text-[11px] text-slate-400 mb-3">Inflow vs consumption over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={inventoryTrendData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="Received" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Consumed" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-purple-500" /> Received</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Consumed</span>
          </div>
        </div>

        {/* CHART 4: FAST VS SLOW MOVING */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Fast vs Slow Moving Products</h3>
          <p className="text-[11px] text-slate-400 mb-3">Monthly sales velocity comparison</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={velocityData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="Fast" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Slow" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Fast Moving</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-500" /> Slow Moving</span>
          </div>
        </div>

      </div>

      {/* SEARCH, FILTERS & INVENTORY TABLE */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm">
        
        {/* HEADER & FILTERS BAR */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-base">Inventory Catalog</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Showing {filteredProducts.length} items</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search SKU or Product..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-transparent focus:border-blue-400 focus:outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Filter Category */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Dairy & Cheese">Dairy & Cheese</option>
              <option value="Beverages">Beverages</option>
              <option value="Bakery">Bakery</option>
              <option value="Packaging">Packaging</option>
              <option value="Spices & Sauces">Spices & Sauces</option>
              <option value="Frozen Foods">Frozen Foods</option>
            </select>

            {/* Filter Supplier */}
            <select
              value={supplierFilter}
              onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Suppliers</option>
              <option value="FreshDairy Co">FreshDairy Co</option>
              <option value="Supreme Foods">Supreme Foods</option>
              <option value="Bakers Union">Bakers Union</option>
              <option value="Packaging Hub">Packaging Hub</option>
              <option value="Global Spices">Global Spices</option>
            </select>

            {/* Filter Stock Status */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Stock Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Expiring Soon">Expiring Soon</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-xs min-w-[900px]">
            <thead>
              <tr className="text-left uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 pr-4 font-semibold">Product Name</th>
                <th className="py-3 pr-4 font-semibold">SKU</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">
                  <button onClick={() => toggleSort("currentStock")} className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300">
                    Current Stock <ArrowUpDown size={11} className={sortKey === "currentStock" ? "text-blue-500" : ""} />
                  </button>
                </th>
                <th className="py-3 pr-4 font-semibold">Reorder Level</th>
                <th className="py-3 pr-4 font-semibold">Supplier</th>
                <th className="py-3 pr-4 font-semibold">Batch No</th>
                <th className="py-3 pr-4 font-semibold">Expiry Date</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No matching inventory products found.
                  </td>
                </tr>
              ) : (
                pagedProducts.map((p) => {
                  const statusBadge =
                    p.status === "Healthy"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                      : p.status === "Low Stock"
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      : p.status === "Expiring Soon"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";

                  const dotColor =
                    p.status === "Healthy" ? "bg-emerald-500" : p.status === "Low Stock" ? "bg-amber-500" : p.status === "Expiring Soon" ? "bg-yellow-500" : "bg-rose-500";

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">{p.name}</td>
                      <td className="py-3 pr-4 text-slate-500 font-mono text-[11px]">{p.sku}</td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{p.category}</td>
                      <td className="py-3 pr-4 font-bold tabular-nums text-slate-900 dark:text-white">{p.currentStock}</td>
                      <td className="py-3 pr-4 tabular-nums text-slate-500">{p.reorderLevel}</td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{p.supplier}</td>
                      <td className="py-3 pr-4 text-slate-400 font-mono text-[11px]">{p.batchNo}</td>
                      <td className="py-3 pr-4 tabular-nums text-slate-500">{p.expiryDate}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} /> {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD PRODUCT */}
      <AnimatePresence>
        {modalType === "add" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 shadow-2xl relative"
            >
              <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-500" /> Add New Inventory Product
              </h3>
              <p className="text-xs text-slate-400 mb-4">Enter SKU and stock details into the system catalog.</p>

              <form onSubmit={handleAddProduct} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Product Name</label>
                    <input
                      required
                      value={newProd.name}
                      onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                      placeholder="e.g. Organic Milk 1L"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">SKU Code</label>
                    <input
                      required
                      value={newProd.sku}
                      onChange={e => setNewProd({ ...newProd, sku: e.target.value })}
                      placeholder="SKU-MK-88"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category</label>
                    <select
                      value={newProd.category}
                      onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    >
                      <option>Dairy & Cheese</option><option>Beverages</option><option>Bakery</option><option>Packaging</option><option>Spices & Sauces</option><option>Frozen Foods</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Supplier</label>
                    <select
                      value={newProd.supplier}
                      onChange={e => setNewProd({ ...newProd, supplier: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    >
                      <option>FreshDairy Co</option><option>Supreme Foods</option><option>Bakers Union</option><option>Packaging Hub</option><option>Global Spices</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Current Stock</label>
                    <input
                      type="number"
                      required
                      value={newProd.currentStock}
                      onChange={e => setNewProd({ ...newProd, currentStock: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Reorder Threshold</label>
                    <input
                      type="number"
                      required
                      value={newProd.reorderLevel}
                      onChange={e => setNewProd({ ...newProd, reorderLevel: e.target.value })}
                      placeholder="25"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newProd.expiryDate}
                      onChange={e => setNewProd({ ...newProd, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xs shadow-md mt-2"
                >
                  Save Product to Catalog
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: UPDATE STOCK */}
      <AnimatePresence>
        {modalType === "update" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 shadow-2xl relative"
            >
              <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Edit3 size={20} className="text-blue-500" /> Quick Stock Adjustment
              </h3>
              <p className="text-xs text-slate-400 mb-4">Select product and update current count.</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Select Product</label>
                  <select className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none">
                    {products.map(p => <option key={p.id}>{p.name} ({p.sku})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Adjustment Quantity (+ / -)</label>
                  <input type="number" placeholder="+50 or -10" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                </div>
                <button
                  onClick={() => { setModalType(null); showToast("Stock updated successfully!"); }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md mt-2"
                >
                  Update Stock Quantity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREATE PURCHASE ORDER */}
      <AnimatePresence>
        {modalType === "po" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 shadow-2xl relative"
            >
              <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <ShoppingCart size={20} className="text-blue-500" /> Generate Purchase Order
              </h3>
              <p className="text-xs text-slate-400 mb-4">Send automated PO request to supplier.</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Supplier</label>
                  <select className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none">
                    <option>FreshDairy Co</option><option>Supreme Foods</option><option>Bakers Union</option><option>Packaging Hub</option><option>Global Spices</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Order Quantity (Units)</label>
                  <input type="number" defaultValue="200" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Expected Delivery Date</label>
                  <input type="date" defaultValue="2026-08-05" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                </div>
                <button
                  onClick={() => { setModalType(null); showToast("Purchase Order PO-9082 sent to supplier!"); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xs shadow-md mt-2 flex items-center justify-center gap-1.5"
                >
                  <Send size={13} /> Send Purchase Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
