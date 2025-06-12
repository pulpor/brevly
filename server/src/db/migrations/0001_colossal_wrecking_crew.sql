ALTER TABLE "links" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "original_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "short_code" SET DATA TYPE text;