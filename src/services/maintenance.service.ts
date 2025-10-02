import { api } from "@/lib/api";

export type Maintenance = {
  id: number;
  vehicleId: number;
  title: string;
  cost: number;
  date: number;
  notes?: string | null;
};

export async function listMaintenances(
  vehicleId: number
): Promise<Maintenance[]> {
  const { data } = await api.get(`/api/maintenances/${vehicleId}`);
  return data;
}

export async function createMaintenance(input: {
  vehicleId: number;
  title: string;
  cost: number;
  date: string | Date;
  notes?: string;
}) {
  const payload = { ...input, date: new Date(input.date).toISOString() };
  const { data } = await api.post("/api/maintenances", payload);
  return data as Maintenance;
}
