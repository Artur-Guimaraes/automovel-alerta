import { api } from "@/lib/api";

export type Refueling = {
  id: number;
  vehicleId: number;
  liters: number;
  pricePerLiter: number;
  total: number;
  date: number; // epoch seconds no back
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
}) {
  const payload = { ...input, date: new Date(input.date).toISOString() };
  const { data } = await api.post("/api/refuelings", payload);
  return data as Refueling;
}
