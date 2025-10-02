import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Usuários: não gravamos dados pessoais; só o id do Supabase
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // supabase user id
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// Veículos
export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(), // users.id
  name: text("name").notNull(),
  model: text("model"),
  plate: text("plate"),
  mileage: real("mileage").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// Abastecimentos (combustível)
export const refuelings = sqliteTable("refuelings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  liters: real("liters").notNull(),
  pricePerLiter: real("price_per_liter").notNull(),
  total: real("total").notNull(), // liters * pricePerLiter
  date: integer("date", { mode: "timestamp" }).notNull(),
});

// Manutenções
export const maintenances = sqliteTable("maintenances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  title: text("title").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  notes: text("notes"),
});

// Outros gastos (estacionamento, seguro, financiamento etc.)
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  title: text("title").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  // marca se é recorrente (mensal, por ex.) — implementação simples por enquanto
  isRecurringMonthly: integer("is_rec_monthly", { mode: "boolean" }).default(
    false
  ),
});
