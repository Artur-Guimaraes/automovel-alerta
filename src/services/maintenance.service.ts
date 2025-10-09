import { api } from "@/lib/api";

export type Maintenance = {
  id: number;
  vehicleId: number;
  title: string;
  cost: number;
  date: number; // epoch (seg)
  notes?: string | null;
  mileage?: number; // km do odômetro no dia
};

export type CreateMaintenanceInput = {
  vehicleId: number;
  title: string;
  cost: number;
  date: string | Date;
  notes?: string;
  mileage?: number;
};
export type UpdateMaintenanceInput = {
  title?: string;
  cost?: number;
  date?: string | Date;
  notes?: string | null;
  mileage?: number;
};

export async function listMaintenances(
  vehicleId: number
): Promise<Maintenance[]> {
  const { data } = await api.get(`/api/maintenances/${vehicleId}`);
  return data;
}
export async function createMaintenance(input: CreateMaintenanceInput) {
  const { data } = await api.post("/api/maintenances", input);
  return data as Maintenance;
}
export async function updateMaintenance(
  id: number,
  patch: UpdateMaintenanceInput
) {
  const { data } = await api.put(`/api/maintenances/${id}`, patch);
  return data as Maintenance;
}
export async function deleteMaintenance(id: number) {
  await api.delete(`/api/maintenances/${id}`);
}
