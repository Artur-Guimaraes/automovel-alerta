import { api } from "@/lib/api";

export type CostsSummary = { period: string; total: number };

export async function getCostsSummary(params: {
  period?: "day" | "month" | "year";
  vehicleId?: number;
}) {
  const search = new URLSearchParams();
  if (params.period) search.set("period", params.period);
  if (params.vehicleId) search.set("vehicleId", String(params.vehicleId));
  const { data } = await api.get(`/api/costs/summary?${search.toString()}`);
  return data as {
    period: string;
    vehicleId: number | null;
    summary: CostsSummary[];
  };
}
