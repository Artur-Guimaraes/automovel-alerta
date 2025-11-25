import { db } from "./db.js";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

async function main() {
  // adiciona mileage se não existir
  db.run(`ALTER TABLE refuelings ADD COLUMN mileage INTEGER`);
}

main()
  .then(() => {
    console.log("Migração ok");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
