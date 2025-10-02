// back-end/drizzle.config.cjs
/** @type { import("drizzle-kit").Config } */
module.exports = {
  dialect: "sqlite",
  schema: "./src/schema.ts",     // agora vai encontrar
  out: "./drizzle",
  dbCredentials: { url: "./sqlite.db" }
};
