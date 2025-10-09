import { api } from "@/lib/api";

export type Dashboard = {
  userId: string;
  vehicles: Array<{
    id: number;
    name: string;
    model?: string;
    plate?: string;
    mileage?: number;
    createdAt?: number;
    ownerId?: string;
  }>;
  vehiclesCount: number;
  summary: {
    monthPeriod: string; // "2025-10"
    byCategory: { refuelings: number; maintenances: number; expenses: number };
    total: number;
  };
  recentRefuelings: Array<{
    id: number;
    vehicleId: number;
    vehicleName: string;
    liters: number;
    pricePerLiter: number;
    total: number;
    fuelType: string;
    date: number;
  }>;
  recentMaintenances: Array<{
    id: number;
    vehicleId: number;
    vehicleName: string;
    title: string;
    cost: number;
    date: number;
    notes?: string | null;
    mileage?: number;
  }>;
};

export async function getDashboard(): Promise<Dashboard> {
  const { data } = await api.get("/api/dashboard");
  return data;
}
