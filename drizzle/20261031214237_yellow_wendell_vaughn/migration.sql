-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "type" AS ENUM('Поставка', 'Продажа', 'Возврат');--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"invoice_type" "type" DEFAULT 'Поставка'::"type" NOT NULL,
	"invoice_sum" numeric(10,2),
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255),
	"legal_form" varchar(20),
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_types" (
	"id" serial PRIMARY KEY,
	"name" varchar(255),
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" bigint NOT NULL,
	"invoice_id" uuid NOT NULL,
	"quantity" numeric(10,2) NOT NULL,
	"price" numeric(10,2),
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"quantity_sum" numeric(10,2) GENERATED ALWAYS AS ((quantity * price)) STORED
);
--> statement-breakpoint
CREATE TABLE "product_types" (
	"id" serial PRIMARY KEY CONSTRAINT "product_types_id_key" UNIQUE,
	"name" varchar(255) NOT NULL CONSTRAINT "product_types_name_key" UNIQUE,
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" bigserial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"product_type" integer,
	"price" numeric(10,2) NOT NULL,
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipt_positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_items_id" uuid,
	"product_id" bigint,
	"receipt_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" numeric(10,2) NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"sum" numeric(10,2) GENERATED ALWAYS AS ((price * quantity)) STORED,
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"users_id" uuid NOT NULL,
	"organizations_id" uuid,
	"payment_types" integer NOT NULL,
	"check_sum" numeric(10,2) NOT NULL,
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" varchar(50) NOT NULL CONSTRAINT "users_username_key" UNIQUE,
	"email" varchar(120) NOT NULL CONSTRAINT "users_email_key" UNIQUE,
	"password_hash" text NOT NULL,
	"update_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "product_items_idx" ON "product_items" ("id");--> statement-breakpoint
CREATE INDEX "product_items_invoice_idx" ON "product_items" ("invoice_id");--> statement-breakpoint
CREATE INDEX "product_items_product_idx" ON "product_items" ("product_id");--> statement-breakpoint
CREATE INDEX "products_idx" ON "products" ("id");--> statement-breakpoint
CREATE INDEX "receipt_positions_idx" ON "receipt_positions" ("id");--> statement-breakpoint
CREATE INDEX "receipt_positions_product_idx" ON "receipt_positions" ("product_id");--> statement-breakpoint
CREATE INDEX "receipt_positions_receipt_idx" ON "receipt_positions" ("receipt_id");--> statement-breakpoint
CREATE INDEX "receipts_organizations_idx" ON "receipts" ("organizations_id");--> statement-breakpoint
CREATE INDEX "receipts_user_idx" ON "receipts" ("users_id");--> statement-breakpoint
CREATE INDEX "users_idx" ON "users" ("id");--> statement-breakpoint
CREATE INDEX "users_username" ON "users" ("username");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_product_types_id_fkey" FOREIGN KEY ("product_type") REFERENCES "product_types"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_invoice_id_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_organizations_id_organizations_id_fkey" FOREIGN KEY ("organizations_id") REFERENCES "organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_payment_types_payment_types_id_fkey" FOREIGN KEY ("payment_types") REFERENCES "payment_types"("id");--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_users_id_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "receipt_positions" ADD CONSTRAINT "receipt_positions_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "receipt_positions" ADD CONSTRAINT "receipt_positions_product_items_id_product_items_id_fkey" FOREIGN KEY ("product_items_id") REFERENCES "product_items"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "receipt_positions" ADD CONSTRAINT "receipt_positions_receipt_id_receipts_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE RESTRICT;
*/