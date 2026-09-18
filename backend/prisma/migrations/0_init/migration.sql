-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'Outlet Manager',
    "phone" VARCHAR(20),
    "assigned_outlet_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "outlets" (
    "outlet_id" SERIAL NOT NULL,
    "outlet_name" VARCHAR(150),
    "owner_name" VARCHAR(100),
    "manager_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "address" TEXT,
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "region" VARCHAR(20),
    "franchise_id" INTEGER,
    "health" INTEGER NOT NULL DEFAULT 80,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "profit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "growth" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 4.0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Healthy',
    "opening_date" DATE,

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("outlet_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "cost_price" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(20) NOT NULL DEFAULT 'units',
    "status" VARCHAR(20) NOT NULL DEFAULT 'Available',

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "inventory_id" SERIAL NOT NULL,
    "outlet_id" INTEGER,
    "product_id" INTEGER,
    "product_name" VARCHAR(100),
    "category" VARCHAR(50),
    "quantity" INTEGER,
    "unit_price" DECIMAL(10,2),
    "current_stock" INTEGER DEFAULT 0,
    "reorder_level" INTEGER DEFAULT 20,
    "supplier_name" VARCHAR(100),
    "batch_no" VARCHAR(50),
    "expiry_date" DATE,
    "status" VARCHAR(30) DEFAULT 'Healthy',
    "last_updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "purchase_order_id" SERIAL NOT NULL,
    "po_number" VARCHAR(50) NOT NULL,
    "supplier_name" VARCHAR(100) NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "order_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_date" DATE NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'Pending',
    "total_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("purchase_order_id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "purchase_order_item_id" SERIAL NOT NULL,
    "purchase_order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("purchase_order_item_id")
);

-- CreateTable
CREATE TABLE "audit_evidence" (
    "evidence_id" SERIAL NOT NULL,
    "evidence_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'Needs Review',
    "ai_score" INTEGER NOT NULL DEFAULT 70,
    "upload_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "file_url" TEXT,
    "file_size" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_evidence_pkey" PRIMARY KEY ("evidence_id")
);

-- CreateTable
CREATE TABLE "audits" (
    "audit_id" SERIAL NOT NULL,
    "outlet_id" INTEGER,
    "audit_date" DATE,
    "audit_type" VARCHAR(50),
    "auditor_name" VARCHAR(100),
    "score" INTEGER,
    "remarks" TEXT,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "staff" (
    "staff_id" SERIAL NOT NULL,
    "outlet_id" INTEGER,
    "staff_name" VARCHAR(100),
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "role" VARCHAR(50),
    "shift" VARCHAR(50) DEFAULT 'Morning (07:00-15:00)',
    "salary" DECIMAL(10,2),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "joining_date" DATE,
    "rating" DECIMAL(3,2) DEFAULT 4.5,
    "sales_per_hour" DECIMAL(10,2) DEFAULT 0,
    "attendance" INTEGER DEFAULT 95,
    "leaves_taken" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'On Shift',

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "swift_leaves" (
    "leave_id" SERIAL NOT NULL,
    "leave_code" VARCHAR(50) NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "leave_type" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "total_days" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending AI Approval',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'Normal',
    "ai_conflict" TEXT,
    "replacement_suggested" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swift_leaves_pkey" PRIMARY KEY ("leave_id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "campaign_id" SERIAL NOT NULL,
    "campaign_name" VARCHAR(100),
    "outlet_id" INTEGER,
    "campaign_type" VARCHAR(50),
    "platform" VARCHAR(50) DEFAULT 'Google Ads',
    "start_date" DATE,
    "end_date" DATE,
    "budget" DECIMAL(10,2),
    "spent" DECIMAL(10,2) DEFAULT 0,
    "impressions" INTEGER DEFAULT 0,
    "clicks" INTEGER DEFAULT 0,
    "conversions" INTEGER DEFAULT 0,
    "expected_reach" INTEGER,
    "roas" DECIMAL(5,2) DEFAULT 0.0,
    "status" VARCHAR(30) DEFAULT 'Active',

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("campaign_id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "promotion_id" SERIAL NOT NULL,
    "promo_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "discount_pct" DECIMAL(5,2) NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Active',
    "usage_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateTable
CREATE TABLE "sales" (
    "sale_id" SERIAL NOT NULL,
    "outlet_id" INTEGER,
    "sale_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "total_amount" DECIMAL(10,2),
    "customers" INTEGER,
    "expenses" DECIMAL(10,2),
    "orders" INTEGER,
    "profit" DECIMAL(10,2),
    "revenue" DECIMAL(10,2),

    CONSTRAINT "sales_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "expense_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "expense_type" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "expense_date" DATE NOT NULL,
    "description" TEXT,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("expense_id")
);

-- CreateTable
CREATE TABLE "retail_sales" (
    "bill_id" INTEGER NOT NULL,
    "customer_name" VARCHAR(100),
    "city" VARCHAR(100),
    "product_category" VARCHAR(100),
    "quantity" INTEGER,
    "total_amount" DECIMAL(10,2),
    "payment_method" VARCHAR(30),
    "store_type" VARCHAR(50),
    "visit_date" DATE,

    CONSTRAINT "retail_sales_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "franchises" (
    "franchise_id" SERIAL NOT NULL,
    "franchise_name" VARCHAR(100),
    "owner_name" VARCHAR(100),
    "contact_email" VARCHAR(100),
    "contact_phone" VARCHAR(20),
    "headquarters" VARCHAR(100),
    "registration_date" DATE,
    "status" VARCHAR(20),

    CONSTRAINT "franchises_pkey" PRIMARY KEY ("franchise_id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "notification_id" SERIAL NOT NULL,
    "outlet_id" INTEGER,
    "alert_id" INTEGER,
    "alert_type" VARCHAR(50),
    "alert_date" DATE,
    "priority" VARCHAR(20),
    "message" TEXT,
    "notification_type" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20),

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_po_number_key" ON "purchase_orders"("po_number");

-- CreateIndex
CREATE UNIQUE INDEX "audit_evidence_evidence_code_key" ON "audit_evidence"("evidence_code");

-- CreateIndex
CREATE UNIQUE INDEX "swift_leaves_leave_code_key" ON "swift_leaves"("leave_code");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_promo_code_key" ON "promotions"("promo_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_assigned_outlet_id_fkey" FOREIGN KEY ("assigned_outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("purchase_order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_evidence" ADD CONSTRAINT "audit_evidence_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swift_leaves" ADD CONSTRAINT "swift_leaves_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swift_leaves" ADD CONSTRAINT "swift_leaves_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

