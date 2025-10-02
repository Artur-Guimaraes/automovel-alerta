import { api } from "@/lib/api";

export type Vehicle = {
  id: number;
  name: string;
  model?: string;
  plate?: string;
  mileage?: number;
  createdAt?: number;
  ownerId?: string;
};

export async function listVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get("/api/vehicles");
  return data;
}

export async function createVehicle(
  input: Omit<Vehicle, "id" | "createdAt" | "ownerId">
) {
  const { data } = await api.post("/api/vehicles", input);
  return data as Vehicle;
}

export async function deleteVehicle(id: number) {
  await api.delete(`/api/vehicles/${id}`);
}
