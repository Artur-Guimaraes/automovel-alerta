import { api } from "@/lib/api";

/** Tipos exatamente como a API espera (MAIÚSCULOS) */
export type FuelType =
  | "GASOLINA"
  | "GASOLINA_ADITIVADA"
  | "ETANOL"
  | "DIESEL"
  | "GNV";

export type Refueling = {
  id: number;
  vehicleId: number;
  liters: number;
  pricePerLiter: number;
  total: number;
  date: number; // epoch (segundos)
  fuelType: FuelType;
  mileage: number | null; // odômetro no momento do abastecimento
};

export type RefuelingMetrics = {
  vehicleId: number;
  rangeDays: number;
  from: number;
  to: number;
  fillups: number;
  liters: number;
  fuelCost: number;
  avgPricePerLiter: number;
  byFuelType: Record<string, { liters: number; cost: number }>;
  kmDriven: number | null;
  avgKmPerL: number | null;
  costPerKm: number | null;
};

/* ----------------------------- helpers ----------------------------- */
const toNumberBR = (v: string | number): number => {
  if (typeof v === "number") return v;
  // aceita "6,09" ou "6.09"
  return Number(String(v).replace(/\./g, "").replace(",", "."));
};

const toIntFromAny = (v: string | number): number =>
  Number(String(v).replace(/\D/g, "")) || 0;

const normFuel = (f: string): FuelType =>
  String(f || "GASOLINA").toUpperCase() as FuelType;

/* ------------------------------ API ------------------------------- */
export async function listRefuelings(vehicleId: number): Promise<Refueling[]> {
  const { data } = await api.get(`/api/refuelings/${vehicleId}`);
  return data as Refueling[];
}

/**
 * Cria um abastecimento.
 * mileage (odômetro) é OBRIGATÓRIO — o back-end valida isso.
 * Aceita liters/pricePerLiter como string com vírgula.
 */
export async function createRefueling(input: {
  vehicleId: number;
  liters: string | number;
  pricePerLiter: string | number;
  date: string | Date; // "YYYY-MM-DD" ou Date
  fuelType: FuelType | string;
  mileage: string | number; // odômetro no momento do abastecimento
}): Promise<Refueling> {
  const payload = {
    vehicleId: input.vehicleId,
    liters: toNumberBR(input.liters),
    pricePerLiter: toNumberBR(input.pricePerLiter),
    date: input.date,
    fuelType: normFuel(input.fuelType as string),
    mileage: toIntFromAny(input.mileage),
  };

  const { data } = await api.post("/api/refuelings", payload);
  return data as Refueling;
}

export async function deleteRefueling(id: number) {
  await api.delete(`/api/refuelings/${id}`);
}

/**
 * Métricas calculadas por **pares consecutivos** de abastecimentos
 * (delta de quilometragem entre eles). O parâmetro `range`
 * segue o padrão "30d" | "90d" etc.
 */
export async function getRefuelingMetrics(
  vehicleId: number,
  range: "30d" | "60d" | "90d" | "180d" | "365d" = "90d"
): Promise<RefuelingMetrics> {
  const { data } = await api.get(`/api/refuelings/${vehicleId}/metrics`, {
    params: { range },
  });
  return data as RefuelingMetrics;
}
