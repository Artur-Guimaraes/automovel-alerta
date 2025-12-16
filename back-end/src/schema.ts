import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "number" }).default(
    sql`(unixepoch())`
  ),
});

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  model: text("model"),
  plate: text("plate"),
  mileage: real("mileage").default(0),
  createdAt: integer("created_at", { mode: "number" }).default(
    sql`(unixepoch())`
  ),
});

export const refuelings = sqliteTable("refuelings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  liters: real("liters").notNull(),
  pricePerLiter: real("price_per_liter").notNull(),
  total: real("total").notNull(),
  date: integer("date").notNull(), // epoch (segundos)
  fuelType: text("fuel_type"), // GASOLINA, ETANOL, etc.
  mileage: integer("mileage"), // odômetro no momento do abastecimento
});

export const maintenances = sqliteTable("maintenances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  title: text("title").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: "number" }).notNull(),
  notes: text("notes"),
  mileage: real("mileage").default(0),
});

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  title: text("title").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: "number" }).notNull(),
  isRecurringMonthly: integer("is_rec_monthly", { mode: "boolean" }).default(
    false
  ),
});
