// FranchiseOps AI - Inventory Agent Mock Data

export const INVENTORY_SUMMARY = {
  totalItems: 420,
  lowStockItems: 14,
  outOfStockItems: 2,
  stockTurnoverRate: "6.8x",
  totalStockValue: "₹84.5L",
  items: [
    { id: "INV-101", name: "Premium Artisan Coffee Beans (1kg)", category: "Beverages", stockLevel: "850 bags", reorderPoint: 200, status: "Healthy", supplier: "South Malabar Coffee Co" },
    { id: "INV-102", name: "Organic Whole Milk (1L)", category: "Dairy", stockLevel: "120 cartons", reorderPoint: 150, status: "Low Stock", supplier: "Nandini Fresh Dairy" },
    { id: "INV-103", name: "BOGO Special Packaging Boxes", category: "Packaging", stockLevel: "4,500 units", reorderPoint: 1000, status: "Healthy", supplier: "PackMaster India" },
    { id: "INV-104", name: "Matcha Powder (500g)", category: "Beverages", stockLevel: "8 units", reorderPoint: 25, status: "Critical Low", supplier: "Kyoto Imports" }
  ]
};
