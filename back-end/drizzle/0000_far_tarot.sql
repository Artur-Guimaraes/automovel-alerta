CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`vehicle_id` integer NOT NULL,
	`title` text NOT NULL,
	`cost` real NOT NULL,
	`date` integer NOT NULL,
	`is_rec_monthly` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `maintenances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`vehicle_id` integer NOT NULL,
	`title` text NOT NULL,
	`cost` real NOT NULL,
	`date` integer NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `refuelings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`vehicle_id` integer NOT NULL,
	`liters` real NOT NULL,
	`price_per_liter` real NOT NULL,
	`total` real NOT NULL,
	`date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`model` text,
	`plate` text,
	`mileage` real DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch())
);
