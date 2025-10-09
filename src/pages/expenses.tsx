"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  differenceInCalendarMonths,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { z } from "zod";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// services
import {
  listVehicles,
  type Vehicle as VehicleRow,
} from "@/services/vehicle.service";
import { listRefuelings } from "@/services/refueling.service";
import { listMaintenances } from "@/services/maintenance.service";
import {
  listOtherExpenses,
  createOtherExpense,
  type OtherExpenseInput,
} from "@/services/expenses.service";

// ===== Tipos locais (unificados) =====
export type ExpenseCategory =
  | "Combustível"
  | "Manutenção"
  | "Estacionamento"
  | "Seguro"
  | "Financiamento"
  | "Outros";
export type Recurrence = "Nenhuma" | "Semanal" | "Mensal" | "Anual";

export type Expense = {
  id: string | number;
  vehicleId: number;
  categoria: ExpenseCategory;
  descricao?: string;
  valor: number; // R$
  dataHora: string; // ISO
  recorrente?: boolean;
  periodicidade?: Recurrence; // se recorrente
  observacoes?: string;
};

// ===== Helpers de formato =====
const fBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pBRL = (s: string) => {
  const only = s
    .replace(/[^0-9,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\.|,|$))/g, "")
    .replace(/,/g, ".");
  const v = Number(only);
  return isNaN(v) ? 0 : v;
};
const toISO = (date: number | string) =>
  typeof date === "number"
    ? new Date(date * 1000).toISOString()
    : new Date(date).toISOString();

// Máscara BRL: digita números e formata em moeda
const maskCurrencyBRL = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  const value = Number(digits) / 100;
  const mask = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return { mask, value };
};

// ===== Zod schema com máscaras =====
const schema = z.object({
  vehicleId: z.number().min(1, "Selecione um veículo"),
  categoria: z.custom<ExpenseCategory>(),
  descricao: z.string().optional().default(""),
  valorMask: z
    .string()
    .min(1)
    .transform((s) => ({ mask: s, value: pBRL(s) })),
  dataHora: z.string(), // "yyyy-MM-dd"
  recorrente: z.boolean().default(false),
  periodicidade: z.custom<Recurrence>().optional(),
  observacoes: z.string().optional().default(""),
});

export default function Expenses() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const COLORS = {
    azul: isDarkMode ? "#60a5fa" : "#2563eb",
    vermelho: "#ef4444",
    verde: "#22c55e",
    laranja: "#f59e0b",
    azulEscuro: "#1e3a8a",
    cinza: "#9ca3af",
    roxo: "#a855f7",
    ciano: "#06b6d4",
  } as const;

  const tooltipProps = {
    contentStyle: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      padding: "8px 10px",
    } as React.CSSProperties,
    labelStyle: { color: axisColor } as React.CSSProperties,
    itemStyle: { color: axisColor } as React.CSSProperties,
    wrapperStyle: { outline: "none" } as React.CSSProperties,
  };
  const cursorFill = isDarkMode
    ? "rgba(148,163,184,0.08)"
    : "rgba(2,6,23,0.06)";

  // ===== Estado (dinâmico do back) =====
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [vehicleId, setVehicleId] = useState<number>(0);

  const [refuelings, setRefuelings] = useState<any[]>([]);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [otherExpenses, setOtherExpenses] = useState<Expense[]>([]);

  // carrega veículos e seleciona o primeiro
  useEffect(() => {
    (async () => {
      const v = await listVehicles();
      setVehicles(v);
      if (v.length) setVehicleId(v[0].id);
    })();
  }, []);

  // carrega gastos quando muda o veículo
  useEffect(() => {
    if (!vehicleId) return;
    (async () => {
      const [r, m, o] = await Promise.all([
        listRefuelings(vehicleId),
        listMaintenances(vehicleId),
        listOtherExpenses(vehicleId),
      ]);
      setRefuelings(r);
      setMaintenances(m);
      setOtherExpenses(
        o.map<Expense>((it) => ({
          id: it.id,
          vehicleId,
          categoria: it.category,
          descricao: it.description,
          valor: Number(it.amount ?? 0),
          dataHora: toISO(it.date),
          recorrente: !!it.recurring,
          periodicidade: it.recurrence,
          observacoes: it.notes,
        }))
      );
    })();
  }, [vehicleId]);

  // unifica tudo
  const allExpenses = useMemo<Expense[]>(() => {
    const fuels: Expense[] = refuelings.map((r) => ({
      id: r.id,
      vehicleId: r.vehicleId ?? vehicleId,
      categoria: "Combustível",
      descricao: "Abastecimento",
      valor:
        r.total != null
          ? Number(r.total)
          : Number(r.liters) * Number(r.pricePerLiter),
      dataHora: toISO(r.date),
    }));

    const maint: Expense[] = maintenances.map((m) => ({
      id: m.id,
      vehicleId: m.vehicleId ?? vehicleId,
      categoria: "Manutenção",
      descricao: m.title ?? "Manutenção",
      valor: Number(m.cost ?? 0),
      dataHora: toISO(m.date),
    }));

    const merged = [...fuels, ...maint, ...otherExpenses].filter(
      (e) => e.vehicleId === vehicleId
    );

    // ordena desc pela data
    return merged.sort(
      (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
    );
  }, [vehicleId, refuelings, maintenances, otherExpenses]);

  // ===== formulário do modal (com máscara BRL e datepicker) =====
  const [open, setOpen] = useState(false);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const [form, setForm] = useState({
    vehicleId: vehicleId,
    categoria: "Estacionamento" as ExpenseCategory,
    descricao: "",
    valorMask: "", // usuário digita números e vemos "R$ x,xx"
    dataHora: todayStr, // apenas data (yyyy-MM-dd)
    recorrente: false,
    periodicidade: "Mensal" as Recurrence,
    observacoes: "",
  });

  // mantém vehicleId do form sincronizado
  useEffect(() => {
    setForm((f) => ({ ...f, vehicleId }));
  }, [vehicleId]);

  // ===== KPIs =====
  const now = new Date();
  const kpis = useMemo(() => {
    const total = allExpenses.reduce((a, e) => a + e.valor, 0);
    const hoje = allExpenses
      .filter((e) => isSameDay(new Date(e.dataHora), now))
      .reduce((a, e) => a + e.valor, 0);
    const mesAtual = allExpenses
      .filter((e) => isSameMonth(new Date(e.dataHora), now))
      .reduce((a, e) => a + e.valor, 0);
    const anoAtual = allExpenses
      .filter((e) => isSameYear(new Date(e.dataHora), now))
      .reduce((a, e) => a + e.valor, 0);

    // gasto médio mensal = total / nº de meses entre primeiro gasto e agora (>=1)
    let mediaMensal = 0;
    if (allExpenses.length) {
      const first = startOfMonth(
        startOfDay(new Date(allExpenses[allExpenses.length - 1].dataHora))
      );
      const months = Math.max(1, differenceInCalendarMonths(now, first) + 1);
      mediaMensal = total / months;
    }
    return { total, hoje, mesAtual, anoAtual, mediaMensal };
  }, [allExpenses, now]);

  // ===== Dados de gráficos =====
  const chartData = useMemo(() => {
    // por dia (últimos 30)
    const last30: { data: string; valor: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const soma = allExpenses
        .filter((e) => isSameDay(new Date(e.dataHora), d))
        .reduce((a, e) => a + e.valor, 0);
      last30.push({ data: format(d, "dd/MM", { locale: ptBR }), valor: soma });
    }

    // por mês (do ano atual) + por categoria (stacked)
    const meses = Array.from(
      { length: 12 },
      (_, i) => new Date(now.getFullYear(), i, 1)
    );
    const porMes = meses.map((m) => {
      const range = [startOfMonth(m), endOfMonth(m)];
      const base: any = {
        mes: format(m, "MM/yyyy", { locale: ptBR }),
        total: 0,
      };
      (
        [
          "Combustível",
          "Manutenção",
          "Estacionamento",
          "Seguro",
          "Financiamento",
          "Outros",
        ] as ExpenseCategory[]
      ).forEach((c) => (base[c] = 0));
      allExpenses.forEach((e) => {
        const dt = new Date(e.dataHora);
        if (dt >= range[0] && dt <= range[1]) {
          base.total += e.valor;
          base[e.categoria] += e.valor;
        }
      });
      return base;
    });

    // pizza por categoria
    const porCategoriaMap = new Map<ExpenseCategory, number>();
    (
      [
        "Combustível",
        "Manutenção",
        "Estacionamento",
        "Seguro",
        "Financiamento",
        "Outros",
      ] as ExpenseCategory[]
    ).forEach((c) => porCategoriaMap.set(c, 0));
    allExpenses.forEach((e) =>
      porCategoriaMap.set(
        e.categoria,
        porCategoriaMap.get(e.categoria)! + e.valor
      )
    );
    const pizza = Array.from(porCategoriaMap.entries()).map(
      ([categoria, valor]) => ({ categoria, valor })
    );

    return { last30, porMes, pizza };
  }, [allExpenses, now]);

  const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    Combustível: COLORS.laranja,
    Manutenção: COLORS.verde,
    Estacionamento: COLORS.ciano,
    Seguro: COLORS.roxo,
    Financiamento: COLORS.azulEscuro,
    Outros: COLORS.cinza,
  };

  // ===== Charts no carrossel =====
  const charts = [
    {
      key: "dia",
      title: "Gastos por dia (últimos 30)",
      render: () => (
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData.last30} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="gDia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.azul} stopOpacity={0.35} />
                <stop
                  offset="100%"
                  stopColor={COLORS.azul}
                  stopOpacity={0.06}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="data"
              stroke={axisColor}
              tick={{ fill: axisColor }}
            />
            <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
            <Tooltip
              {...tooltipProps}
              cursor={{ fill: cursorFill }}
              formatter={(v: any) => fBRL(Number(v))}
            />
            <Area
              type="monotone"
              dataKey="valor"
              name="Gasto"
              stroke={COLORS.azul}
              fill="url(#gDia)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      key: "mes",
      title: "Gastos por mês (stack por categoria)",
      render: () => (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData.porMes} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="mes"
              stroke={axisColor}
              tick={{ fill: axisColor }}
            />
            <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
            <Tooltip
              {...tooltipProps}
              cursor={{ fill: cursorFill }}
              formatter={(v: any) => fBRL(Number(v))}
            />
            <Legend />
            <Bar
              dataKey="Combustível"
              stackId="a"
              name="Combustível"
              fill={COLORS.laranja}
            />
            <Bar
              dataKey="Manutenção"
              stackId="a"
              name="Manutenção"
              fill={COLORS.verde}
            />
            <Bar
              dataKey="Estacionamento"
              stackId="a"
              name="Estacionamento"
              fill={COLORS.ciano}
            />
            <Bar
              dataKey="Seguro"
              stackId="a"
              name="Seguro"
              fill={COLORS.roxo}
            />
            <Bar
              dataKey="Financiamento"
              stackId="a"
              name="Financiamento"
              fill={COLORS.azulEscuro}
            />
            <Bar
              dataKey="Outros"
              stackId="a"
              name="Outros"
              fill={COLORS.cinza}
            />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      key: "pizza",
      title: "Distribuição por categoria",
      render: () => (
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Tooltip
              {...tooltipProps}
              formatter={(v: any) => fBRL(Number(v))}
            />
            <Legend />
            <Pie
              data={chartData.pizza}
              dataKey="valor"
              nameKey="categoria"
              outerRadius={140}
              label
            >
              {chartData.pizza.map((p, i) => (
                <Cell key={i} fill={CATEGORY_COLORS[p.categoria]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ),
    },
  ];

  const [chartIndex, setChartIndex] = useState(0);
  const next = () => setChartIndex((i) => (i + 1) % charts.length);
  const prev = () =>
    setChartIndex((i) => (i - 1 + charts.length) % charts.length);

  // ===== Modal submit =====
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.parse({ ...form, vehicleId });
    const payload: OtherExpenseInput = {
      vehicleId,
      category: form.categoria,
      description: form.descricao,
      amount: parsed.valorMask.value, // numérico a partir da máscara
      date: form.dataHora, // envia "yyyy-MM-dd" (evita bug do -1 dia)
      recurring: form.recorrente,
      recurrence: form.recorrente ? form.periodicidade : "Nenhuma",
      notes: form.observacoes,
    };

    await createOtherExpense(payload);

    // recarrega apenas “outros gastos”
    const o = await listOtherExpenses(vehicleId);
    setOtherExpenses(
      o.map((it) => ({
        id: it.id,
        vehicleId,
        categoria: it.category,
        descricao: it.description,
        valor: Number(it.amount ?? 0),
        dataHora:
          typeof it.date === "number"
            ? new Date(it.date * 1000).toISOString()
            : String(it.date),
        recorrente: !!it.recurring,
        periodicidade: it.recurrence,
        observacoes: it.notes,
      }))
    );

    // limpa os campos e mantém modal aberto para próxima inserção
    const newTodayStr = format(new Date(), "yyyy-MM-dd");
    setForm({
      vehicleId,
      categoria: "Estacionamento",
      descricao: "",
      valorMask: "",
      dataHora: newTodayStr,
      recorrente: false,
      periodicidade: "Mensal",
      observacoes: "",
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Gastos</h1>
          <p className="text-sm text-muted-foreground">
            Todos os gastos do veículo unificados (abastecimento, manutenções e
            outros).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={vehicleId ? String(vehicleId) : undefined}
            onValueChange={(v) => setVehicleId(Number(v))}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Escolha um veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2" disabled={!vehicleId}>
                <Plus className="h-4 w-4" /> Registrar gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo gasto</DialogTitle>
              </DialogHeader>

              <form onSubmit={onSubmit} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4">
                  <Label>Categoria</Label>
                  <Select
                    value={form.categoria}
                    onValueChange={(v) =>
                      setForm({ ...form, categoria: v as ExpenseCategory })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Combustível">Combustível</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Estacionamento">
                        Estacionamento
                      </SelectItem>
                      <SelectItem value="Seguro">Seguro</SelectItem>
                      <SelectItem value="Financiamento">
                        Financiamento
                      </SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label>Valor</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.valorMask}
                    onChange={(e) => {
                      const { mask } = maskCurrencyBRL(e.target.value);
                      setForm({ ...form, valorMask: mask });
                    }}
                    placeholder="R$ 0,00"
                    className="focus-visible:ring-1 focus-visible:ring-muted-foreground/30"
                  />
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.dataHora
                          ? format(new Date(form.dataHora), "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          form.dataHora ? new Date(form.dataHora) : undefined
                        }
                        onSelect={(d) => {
                          if (d)
                            setForm({
                              ...form,
                              dataHora: format(d, "yyyy-MM-dd"),
                            });
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="col-span-12">
                  <Label>Descrição</Label>
                  <Input
                    value={form.descricao}
                    onChange={(e) =>
                      setForm({ ...form, descricao: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-12 flex items-center gap-3">
                  <Switch
                    checked={form.recorrente}
                    onCheckedChange={(v) => setForm({ ...form, recorrente: v })}
                  />
                  <Label>Gasto recorrente</Label>
                  {form.recorrente && (
                    <div className="ml-3 w-[180px]">
                      <Select
                        value={form.periodicidade}
                        onValueChange={(v) =>
                          setForm({ ...form, periodicidade: v as Recurrence })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Periodicidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                          <SelectItem value="Anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="col-span-12">
                  <Label>Observações</Label>
                  <Textarea
                    value={form.observacoes}
                    onChange={(e) =>
                      setForm({ ...form, observacoes: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-12 mt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button type="submit">Salvar e adicionar outro</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* layout 3 colunas */}
      <div className="grid grid-cols-12 gap-6">
        {/* esquerda – últimos gastos */}
        <div className="col-span-12 xl:col-span-3">
          <Card className="h-[520px] overflow-hidden">
            <CardHeader>
              <CardTitle>Últimos gastos</CardTitle>
            </CardHeader>
            {/* scrollbar escondida */}
            <CardContent className="space-y-3 overflow-y-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allExpenses.map((g) => (
                <div
                  key={String(g.id)}
                  className="rounded-xl border p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {format(new Date(g.dataHora), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                    <span className="text-muted-foreground">{g.categoria}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground truncate pr-2">
                      {g.descricao || g.categoria}
                    </span>
                    <span className="font-medium">{fBRL(g.valor)}</span>
                  </div>
                  {g.recorrente && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Recorrente · {g.periodicidade}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* centro – carrossel */}
        <div className="col-span-12 xl:col-span-6">
          <Card className="h-[520px]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {charts[chartIndex].title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={next}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[420px]">
              <div className="h-full w-full">{charts[chartIndex].render()}</div>
            </CardContent>
          </Card>
        </div>

        {/* direita – KPIs (inclui gasto médio mensal) */}
        <div className="col-span-12 xl:col-span-3">
          <div className="grid h-[520px] grid-rows-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{fBRL(kpis.hoje)}</div>
                <p className="text-sm text-muted-foreground">
                  Total gasto hoje
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Este mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {fBRL(kpis.mesAtual)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Soma de {format(now, "MMMM", { locale: ptBR })}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Este ano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {fBRL(kpis.anoAtual)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Acumulado de {format(now, "yyyy")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gasto médio mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {fBRL(kpis.mediaMensal)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Média desde o primeiro registro do veículo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
