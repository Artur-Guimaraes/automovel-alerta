import { api } from "@/lib/api";

export type FuelType =
  | "gasolina"
  | "gasolina_aditivada"
  | "etanol"
  | "diesel"
  | "gnv";

export type Refueling = {
  id: number;
  vehicleId: number;
  liters: number;
  pricePerLiter: number;
  total: number;
  date: number; // epoch (segundos)
  fuelType: FuelType;
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

export async function listRefuelings(vehicleId: number): Promise<Refueling[]> {
  const { data } = await api.get(`/api/refuelings/${vehicleId}`);
  return data;
}

export async function createRefueling(input: {
  vehicleId: number;
  liters: number;
  pricePerLiter: number;
  date: string | Date;
  fuelType: FuelType;
}) {
  const { data } = await api.post("/api/refuelings", input);
  return data as Refueling;
}

export async function deleteRefueling(id: number) {
  await api.delete(`/api/refuelings/${id}`);
}

export async function getRefuelingMetrics(
  vehicleId: number,
  range: "30d" | "60d" | "90d" | "180d" | "365d" = "90d"
): Promise<RefuelingMetrics> {
  const { data } = await api.get(`/api/refuelings/${vehicleId}/metrics`, {
    params: { range },
  });
  return data as RefuelingMetrics;
}
