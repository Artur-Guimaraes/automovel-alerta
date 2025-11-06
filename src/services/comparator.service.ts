import { getRefuelingMetrics } from "@/services/refueling.service";
import { listMaintenances } from "@/services/maintenance.service";
import { listExpenses } from "@/services/expenses.service";
import { api } from "@/lib/api";

export type Vehicle = { id: number; name: string; model?: string | null };

export async function listVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get<Vehicle[]>("/api/vehicles");
  return data;
}

export type CombinedKpis = {
  vehicleId: number;
  rangeDays: number;
  from: number;
  to: number;
  // combustível (do endpoint de métricas)
  fillups: number;
  liters: number;
  fuelCost: number;
  avgPricePerLiter: number;
  kmDriven: number | null;
  avgKmPerL: number | null;
  costPerKm: number | null;
  // complementares (calculadas aqui)
  maintCost: number; // custos de manutenções no período
  otherCost: number; // “outros gastos” no período
  totalCost: number; // soma tudo no período
  dominantFuel?: string | null; // combustível mais usado no período (por litros)
};

export async function getVehicleKpis(
  vehicleId: number,
  range: "30d" | "90d" | "180d" | "365d" = "90d"
): Promise<CombinedKpis> {
  const m = await getRefuelingMetrics(vehicleId, range);
  // pegue listas completas e filtre pelo período retornado pelo endpoint:
  const [maint, exps] = await Promise.all([
    listMaintenances(vehicleId),
    listExpenses(vehicleId),
  ]);

  const inRange = (tsSec: number) => tsSec >= m.from && tsSec <= m.to;

  const maintCost = maint
    .filter((x) => inRange(Number(x.date)))
    .reduce((acc, x) => acc + Number(x.cost ?? 0), 0);

  const otherCost = exps
    .filter((x) => inRange(Number(x.date)))
    .reduce((acc, x) => acc + Number(x.cost ?? 0), 0);

  // combustível dominante por litros
  let dominantFuel: string | null = null;
  if (m.byFuelType && Object.keys(m.byFuelType).length > 0) {
    dominantFuel =
      Object.entries(m.byFuelType).sort(
        (a, b) => b[1].liters - a[1].liters
      )[0]?.[0] ?? null;
  }

  return {
    vehicleId,
    rangeDays: m.rangeDays,
    from: m.from,
    to: m.to,
    fillups: m.fillups,
    liters: m.liters,
    fuelCost: m.fuelCost,
    avgPricePerLiter: m.avgPricePerLiter,
    kmDriven: m.kmDriven,
    avgKmPerL: m.avgKmPerL,
    costPerKm: m.costPerKm,
    maintCost,
    otherCost,
    totalCost: m.fuelCost + maintCost + otherCost,
    dominantFuel,
  };
}

/** Heurística simples para “últimos veículos usados” — classifica por maior “lastActivity”
 * a partir de datas de refuelings/maintenances/expenses.
 */
export async function pickTwoMostRecentVehicleIds(): Promise<number[]> {
  const vehicles = await listVehicles();
  if (vehicles.length <= 2) return vehicles.map((v) => v.id);

  // puxa listas de todos e mede lastActivity
  const byIdLast: { id: number; last: number }[] = [];
  for (const v of vehicles) {
    const [maint, exps] = await Promise.all([
      listMaintenances(v.id),
      listExpenses(v.id),
    ]);

    // datas de refuelings não temos list aqui? se precisar, pode usar /api/refuelings/:vehicleId
    // para ficar leve, use só maint+expenses (normalmente suficientes para “atividade”)
    const maxMaint = Math.max(0, ...maint.map((m) => Number(m.date || 0)));
    const maxExps = Math.max(0, ...exps.map((e) => Number(e.date || 0)));
    const last = Math.max(maxMaint, maxExps);
    byIdLast.push({ id: v.id, last });
  }

  return byIdLast
    .sort((a, b) => b.last - a.last)
    .slice(0, 2)
    .map((x) => x.id);
}
