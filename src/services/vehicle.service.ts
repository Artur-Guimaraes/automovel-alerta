// src/services/vehicle.service.ts
import { api } from "@/lib/api";

export type Vehicle = {
  id: number;
  name: string;
  model: string;
  plate: string;
  mileage: number;
  ownerId?: string;
  createdAt?: number;
};

export type VehicleInput = {
  name: string;
  model: string;
  plate: string;
  mileage: number;
};

export async function listVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get("/api/vehicles");
  return data;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const { data } = await api.post("/api/vehicles", input);
  return data;
}

export async function updateVehicle(
  id: number,
  input: VehicleInput
): Promise<Vehicle> {
  const { data } = await api.put(`/api/vehicles/${id}`, input);
  return data ?? ({ id, ...input } as Vehicle);
}

export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/api/vehicles/${id}`);
}
