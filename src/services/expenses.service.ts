import { api } from "@/lib/api";

export type Expense = {
  id: number;
  vehicleId: number;
  title: string;
  cost: number;
  date: number;
  isRecurringMonthly?: boolean;
};

export async function listExpenses(vehicleId: number): Promise<Expense[]> {
  const { data } = await api.get(`/api/expenses/${vehicleId}`);
  return data;
}

export async function createExpense(input: {
  vehicleId: number;
  title: string;
  cost: number;
  date: string | Date;
  isRecurringMonthly?: boolean;
}) {
  const payload = { ...input, date: new Date(input.date).toISOString() };
  const { data } = await api.post("/api/expenses", payload);
  return data as Expense;
}
