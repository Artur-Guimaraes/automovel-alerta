import { api } from "@/lib/api";

/** --- Tipos usados pelo back atual (tabela expenses) --- */
export type ExpenseRow = {
  id: number;
  vehicleId: number;
  title: string; // pode ser "Categoria: descrição" OU só "Categoria" OU um título livre
  cost: number; // valor R$
  date: number; // epoch seconds
  isRecurringMonthly?: boolean; // recorrente mensal (boolean)
};

/** --- Tipos usados pela tela de Gastos (outros gastos) --- */
export type ExpenseCategory =
  | "Combustível"
  | "Manutenção"
  | "Estacionamento"
  | "Seguro"
  | "Financiamento"
  | "Outros";

export type Recurrence = "Nenhuma" | "Semanal" | "Mensal" | "Anual";

export type OtherExpense = {
  id: number;
  vehicleId: number;
  category: ExpenseCategory;
  description?: string;
  amount: number;
  date: number; // epoch seconds
  recurring?: boolean;
  recurrence?: Recurrence; // mapeado de isRecurringMonthly
  notes?: string;
};

export type OtherExpenseInput = {
  vehicleId: number;
  category: ExpenseCategory;
  description?: string;
  amount: number; // R$
  date: string | number | Date; // a página envia ISO, mas aceitamos epoch/Date também
  recurring?: boolean;
  recurrence?: Recurrence; // se não vier, e recurring = true, assume "Mensal"
  notes?: string;
};

/** --- Helpers de mapeamento --- */
const CATEGORIES: ExpenseCategory[] = [
  "Combustível",
  "Manutenção",
  "Estacionamento",
  "Seguro",
  "Financiamento",
  "Outros",
];

function parseRowToOther(row: ExpenseRow): OtherExpense {
  // tenta extrair "Categoria: descrição"
  let category: ExpenseCategory = "Outros";
  let description: string | undefined;

  const maybe = row.title?.trim() ?? "";
  const parts = maybe.split(":");
  const head = parts[0]?.trim();

  if (head && (CATEGORIES as string[]).includes(head)) {
    category = head as ExpenseCategory;
    description = parts.slice(1).join(":").trim() || undefined;
  } else if ((CATEGORIES as string[]).includes(maybe)) {
    category = maybe as ExpenseCategory;
  } else {
    // título livre vira descrição, categoria = "Outros"
    description = maybe || undefined;
  }

  return {
    id: row.id,
    vehicleId: row.vehicleId,
    category,
    description,
    amount: row.cost,
    date: row.date,
    recurring: !!row.isRecurringMonthly,
    recurrence: row.isRecurringMonthly ? "Mensal" : "Nenhuma",
  };
}

function buildRowPayload(input: OtherExpenseInput) {
  // regra: se houver descrição, "Categoria: descrição"; senão só "Categoria"
  const title =
    input.description && input.description.trim().length
      ? `${input.category}: ${input.description.trim()}`
      : input.category;

  const date =
    typeof input.date === "number"
      ? input.date
      : input.date instanceof Date
      ? input.date
      : input.date; // string ISO vindo da tela

  return {
    vehicleId: input.vehicleId,
    title,
    cost: input.amount,
    date,
    isRecurringMonthly:
      input.recurring && (input.recurrence === "Mensal" || !input.recurrence)
        ? true
        : false,
  };
}

/** --- Funções usadas pela tela de Gastos --- */
export async function listOtherExpenses(
  vehicleId: number
): Promise<OtherExpense[]> {
  const { data } = await api.get(`/api/expenses/${vehicleId}`);
  const rows = data as ExpenseRow[];
  return rows.map(parseRowToOther);
}

export async function createOtherExpense(
  input: OtherExpenseInput
): Promise<OtherExpense> {
  const payload = buildRowPayload(input);
  const { data } = await api.post("/api/expenses", payload);
  const row = data as ExpenseRow;
  return parseRowToOther(row);
}

export type Expense = ExpenseRow;

export async function listExpenses(vehicleId: number): Promise<Expense[]> {
  const { data } = await api.get(`/api/expenses/${vehicleId}`);
  return data as Expense[];
}

export async function createExpense(input: {
  vehicleId: number;
  title: string;
  cost: number;
  date: string | Date | number;
  isRecurringMonthly?: boolean;
}) {
  const { data } = await api.post("/api/expenses", input);
  return data as Expense;
}
