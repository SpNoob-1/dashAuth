ALTER TABLE "categories" ADD COLUMN "order" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;