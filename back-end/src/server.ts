import "dotenv/config";
import express from "express";
import cors from "cors";
import { db, schema } from "./db";
import { eq, and, desc, gte, lt } from "drizzle-orm";
import { requireAuth } from "./auth";

const app = express();

// helper no topo do arquivo (abaixo dos imports)
const toNumberBR = (v: any) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v.replace(",", "."));
  return Number(v);
};

// Converte "YYYY-MM-DD" (ou Date) para epoch (segundos) SEM deslocar 1 dia
const toEpochLocal = (v: string | Date) => {
  if (v instanceof Date) return Math.floor(v.getTime() / 1000);
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    return Math.floor(new Date(y, m - 1, d).getTime() / 1000);
  }
  return Math.floor(new Date(v as any).getTime() / 1000);
};

// libere o front do Vite (ajuste a porta se a sua for outra)
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

// health check
app.get("/", (_, res) => res.json({ up: true }));
app.get("/health", (_, res) => res.json({ ok: true }));

// exige token apenas em /api/*
app.use("/api", requireAuth);

// helpers de período (timezone local, sem "voltar 1 dia")
const startOfMonthEpoch = () => {
  const now = new Date();
  return Math.floor(
    new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000
  );
};
const startOfNextMonthEpoch = () => {
  const now = new Date();
  return Math.floor(
    new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000
  );
};

// GET /api/dashboard — resumo para o Home
app.get("/api/dashboard", async (req, res) => {
  const ownerId = (req as any).userId as string;

  // veículos do usuário
  const vehicles = await db
    .select()
    .from(schema.vehicles)
    .where(eq(schema.vehicles.ownerId, ownerId))
    .orderBy(schema.vehicles.name);

  const vMap = new Map(vehicles.map((v) => [v.id, v.name]));

  // últimos abastecimentos (5)
  const recentRefuelings = await db
    .select()
    .from(schema.refuelings)
    .where(eq(schema.refuelings.ownerId, ownerId))
    .orderBy(desc(schema.refuelings.date))
    .limit(5);

  // últimas manutenções (5)
  const recentMaintenances = await db
    .select()
    .from(schema.maintenances)
    .where(eq(schema.maintenances.ownerId, ownerId))
    .orderBy(desc(schema.maintenances.date))
    .limit(5);

  // resumo do mês (todas as categorias)
  const ini = startOfMonthEpoch();
  const fim = startOfNextMonthEpoch();

  const monthRefuelings = await db
    .select()
    .from(schema.refuelings)
    .where(
      and(
        eq(schema.refuelings.ownerId, ownerId),
        gte(schema.refuelings.date, ini),
        lt(schema.refuelings.date, fim)
      )
    );

  const monthMaints = await db
    .select()
    .from(schema.maintenances)
    .where(
      and(
        eq(schema.maintenances.ownerId, ownerId),
        gte(schema.maintenances.date, ini),
        lt(schema.maintenances.date, fim)
      )
    );

  const monthExpenses = await db
    .select()
    .from(schema.expenses)
    .where(
      and(
        eq(schema.expenses.ownerId, ownerId),
        gte(schema.expenses.date, ini),
        lt(schema.expenses.date, fim)
      )
    );

  const sum = (arr: any[], key: string) =>
    arr.reduce((acc, x) => acc + Number(x[key] ?? 0), 0);

  const summary = {
    monthPeriod: new Date(ini * 1000).toISOString().slice(0, 7), // YYYY-MM
    byCategory: {
      refuelings: +sum(monthRefuelings, "total").toFixed(2),
      maintenances: +sum(monthMaints, "cost").toFixed(2),
      expenses: +sum(monthExpenses, "cost").toFixed(2),
    },
  };
  const monthTotal =
    summary.byCategory.refuelings +
    summary.byCategory.maintenances +
    summary.byCategory.expenses;

  // adiciona nome do veículo nos itens recentes
  const recentRefuelingsWithName = recentRefuelings.map((r) => ({
    ...r,
    vehicleName: vMap.get(r.vehicleId) || "Veículo",
  }));
  const recentMaintenancesWithName = recentMaintenances.map((m) => ({
    ...m,
    vehicleName: vMap.get(m.vehicleId) || "Veículo",
  }));

  res.json({
    userId: ownerId,
    vehicles,
    vehiclesCount: vehicles.length,
    summary: { ...summary, total: +monthTotal.toFixed(2) },
    recentRefuelings: recentRefuelingsWithName,
    recentMaintenances: recentMaintenancesWithName,
  });
});

app.get("/api/me", (req, res) => {
  res.json({ userId: (req as any).userId });
});

/** -------- VEÍCULOS -------- */
app.get("/api/vehicles", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const rows = await db
    .select()
    .from(schema.vehicles)
    .where(eq(schema.vehicles.ownerId, ownerId));
  res.json(rows);
});

app.post("/api/vehicles", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const { name, model, plate, mileage = 0 } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });

  const inserted = await db
    .insert(schema.vehicles)
    .values({ ownerId, name, model, plate, mileage: Number(mileage) || 0 })
    .returning();
  res.status(201).json(inserted[0]);
});

app.delete("/api/vehicles/:id", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const id = Number(req.params.id);
  await db
    .delete(schema.vehicles)
    .where(
      and(eq(schema.vehicles.id, id), eq(schema.vehicles.ownerId, ownerId))
    );
  res.status(204).end();
});

/** -------- ABASTECIMENTOS -------- */
app.get("/api/refuelings/:vehicleId", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const vehicleId = Number(req.params.vehicleId);
  const rows = await db
    .select()
    .from(schema.refuelings)
    .where(
      and(
        eq(schema.refuelings.ownerId, ownerId),
        eq(schema.refuelings.vehicleId, vehicleId)
      )
    );
  res.json(rows);
});

app.post("/api/refuelings", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const { vehicleId, liters, pricePerLiter, date, fuelType } = req.body || {};

  const l = toNumberBR(liters);
  const ppl = toNumberBR(pricePerLiter);
  const ft = String(fuelType || "gasolina");

  if (!vehicleId || !date || isNaN(l) || isNaN(ppl)) {
    return res.status(400).json({
      error: "vehicleId, liters, pricePerLiter e date são obrigatórios",
    });
  }

  const total = l * ppl;
  const epoch = toEpochLocal(date);

  const row = await db
    .insert(schema.refuelings)
    .values({
      ownerId,
      vehicleId: Number(vehicleId),
      liters: l,
      pricePerLiter: ppl,
      total,
      date: epoch,
      fuelType: ft,
    })
    .returning();

  res.status(201).json(row[0]);
});

app.delete("/api/refuelings/:id", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const id = Number(req.params.id);
  await db
    .delete(schema.refuelings)
    .where(
      and(eq(schema.refuelings.id, id), eq(schema.refuelings.ownerId, ownerId))
    );
  res.status(204).end();
});

/** -------- MANUTENÇÕES -------- */
// GET lista
app.get("/api/maintenances/:vehicleId", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const vehicleId = Number(req.params.vehicleId);

  const rows = await db
    .select()
    .from(schema.maintenances)
    .where(
      and(
        eq(schema.maintenances.ownerId, ownerId),
        eq(schema.maintenances.vehicleId, vehicleId)
      )
    )
    .orderBy(desc(schema.maintenances.date)); // se tiver desc importado
  res.json(rows);
});

// POST (criar)
app.post("/api/maintenances", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const { vehicleId, title, cost, date, notes, mileage } = req.body || {};
  const c = toNumberBR(cost);
  const km = mileage != null ? toNumberBR(mileage) : 0;

  if (!vehicleId || !title || !date || isNaN(c)) {
    return res
      .status(400)
      .json({ error: "vehicleId, title, cost e date são obrigatórios" });
  }
  const epoch = toEpochLocal(date);

  const row = await db
    .insert(schema.maintenances)
    .values({
      ownerId,
      vehicleId: Number(vehicleId),
      title: String(title),
      cost: c,
      date: epoch,
      notes: notes ? String(notes) : null,
      mileage: km,
    })
    .returning();

  res.status(201).json(row[0]);
});

// PUT (editar)
app.put("/api/maintenances/:id", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const id = Number(req.params.id);
  const { title, cost, date, notes, mileage } = req.body || {};

  const patch: any = {};
  if (title !== undefined) patch.title = String(title);
  if (cost !== undefined) patch.cost = toNumberBR(cost);
  if (date !== undefined) patch.date = toEpochLocal(date);
  if (notes !== undefined) patch.notes = notes ? String(notes) : null;
  if (mileage !== undefined) patch.mileage = toNumberBR(mileage);

  const row = await db
    .update(schema.maintenances)
    .set(patch)
    .where(
      and(
        eq(schema.maintenances.id, id),
        eq(schema.maintenances.ownerId, ownerId)
      )
    )
    .returning();

  res.json(row[0]);
});

// DELETE remove
app.delete("/api/maintenances/:id", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const id = Number(req.params.id);
  await db
    .delete(schema.maintenances)
    .where(
      and(
        eq(schema.maintenances.id, id),
        eq(schema.maintenances.ownerId, ownerId)
      )
    );
  res.status(204).end();
});

/** -------- OUTROS GASTOS -------- */
app.get("/api/expenses/:vehicleId", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const vehicleId = Number(req.params.vehicleId);
  const rows = await db
    .select()
    .from(schema.expenses)
    .where(
      and(
        eq(schema.expenses.ownerId, ownerId),
        eq(schema.expenses.vehicleId, vehicleId)
      )
    );
  res.json(rows);
});

app.post("/api/expenses", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const {
    vehicleId,
    title,
    cost,
    date,
    isRecurringMonthly = false,
  } = req.body || {};
  if (!vehicleId || !title || !cost || !date) {
    return res
      .status(400)
      .json({ error: "vehicleId, title, cost e date são obrigatórios" });
  }
  const row = await db
    .insert(schema.expenses)
    .values({
      ownerId,
      vehicleId: Number(vehicleId),
      title: String(title),
      cost: Number(cost),
      date: Math.floor(new Date(date).getTime() / 1000),
      isRecurringMonthly: !!isRecurringMonthly,
    })
    .returning();
  res.status(201).json(row[0]);
});

/** -------- RESUMO DE GASTOS (mês/dia/ano) -------- */
app.get("/api/costs/summary", async (req, res) => {
  const ownerId = (req as any).userId as string;
  const { vehicleId, period = "month" } = req.query as {
    vehicleId?: string;
    period?: string;
  };

  const byVehicle = vehicleId ? Number(vehicleId) : undefined;

  const [refuels, maints, exps] = await Promise.all([
    db
      .select()
      .from(schema.refuelings)
      .where(eq(schema.refuelings.ownerId, ownerId)),
    db
      .select()
      .from(schema.maintenances)
      .where(eq(schema.maintenances.ownerId, ownerId)),
    db
      .select()
      .from(schema.expenses)
      .where(eq(schema.expenses.ownerId, ownerId)),
  ]);

  const map = new Map<string, number>();
  const key = (ts: number) => {
    const d = new Date(ts * 1000);
    if (period === "day")
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    if (period === "year") return `${d.getFullYear()}`;
    return `${d.getFullYear()}-${d.getMonth() + 1}`; // month
  };
  const add = (ts: number, val: number) => {
    const k = key(ts);
    map.set(k, (map.get(k) || 0) + val);
  };

  refuels
    .filter((r) => !byVehicle || r.vehicleId === byVehicle)
    .forEach((r) => add(r.date, r.total));
  maints
    .filter((m) => !byVehicle || m.vehicleId === byVehicle)
    .forEach((m) => add(m.date, m.cost));
  exps
    .filter((e) => !byVehicle || e.vehicleId === byVehicle)
    .forEach((e) => add(e.date, e.cost));

  const summary = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([periodKey, total]) => ({ period: periodKey, total }));

  res.json({ period, vehicleId: byVehicle ?? null, summary });
});

const port = Number(process.env.PORT || 3333);
app.listen(port, () => console.log(`API up on http://localhost:${port}`));
