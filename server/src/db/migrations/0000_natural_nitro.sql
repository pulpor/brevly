CREATE TABLE IF NOT EXISTS "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_url" varchar(2048) NOT NULL,
	"short_code" varchar(50) NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code")
);
