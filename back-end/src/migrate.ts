import { db } from "./db.js";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

async function main() {
  migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations aplicadas com sucesso.");
}
main();
