CREATE TABLE "password_reset_token" (
	"id" text,
	"email" text NOT NULL,
	"token" text UNIQUE,
	"expires" timestamp NOT NULL,
	CONSTRAINT "password_reset_token_pkey" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"id" text,
	"email" text NOT NULL,
	"token" text UNIQUE,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_pkey" PRIMARY KEY("id","token")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;