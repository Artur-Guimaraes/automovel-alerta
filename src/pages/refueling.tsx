"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
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
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

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

// ===== tipos =====
type FuelType = "Gasolina" | "Etanol" | "Diesel" | "GNV" | "Flex";
type Abastecimento = {
  id: string;
  odometro: number; // km
  precoLitro: number; // R$/L
  tipo: FuelType;
  valorTotal: number; // R$
  litros: number; // L
  posto: string;
  motorista: string;
  dataHora: string; // ISO
  tanqueCompleto: boolean;
  observacoes?: string;
};

// ===== helpers =====
const fBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fLitros = (n: number) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fKm = (n: number) => `${n.toLocaleString("pt-BR")} km`;
const pBRL = (s: string) => {
  const only = s
    .replace(/[^0-9,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\.|,|$))/g, "")
    .replace(/,/g, ".");
  const v = Number(only);
  return isNaN(v) ? 0 : v;
};
const pLitros = (s: string) => pBRL(s);
const pKm = (s: string) => Number(s.replace(/[^0-9]/g, ""));

// ===== zod com máscara =====
const schema = z.object({
  odometroMask: z
    .string()
    .min(1)
    .transform((s) => ({ mask: s, value: pKm(s) })),
  precoLitroMask: z
    .string()
    .min(1)
    .transform((s) => ({ mask: s, value: pBRL(s) })),
  tipo: z.custom<FuelType>(),
  valorTotalMask: z
    .string()
    .min(1)
    .transform((s) => ({ mask: s, value: pBRL(s) })),
  litrosMask: z
    .string()
    .min(1)
    .refine(
      (s) => /\d+(,\d{1,2})?$/.test(s.replace(/[^0-9,]/g, "")),
      "Use até 2 casas decimais"
    )
    .transform((s) => ({ mask: s, value: pLitros(s) })),
  posto: z.string().optional().default(""),
  motorista: z.string().optional().default(""),
  dataHora: z.string(),
  tanqueCompleto: z.boolean().default(true),
  observacoes: z.string().optional().default(""),
});

// ===== input com stepper custom =====
function InputWithStepper(props: {
  value: string;
  onChange: (v: string) => void;
  step?: number;
  placeholder?: string;
  className?: string;
}) {
  const { value, onChange, step = 1, placeholder, className } = props;
  const inc = (sinal: 1 | -1) => {
    const isMoney = /R\$/.test(value);
    const isKm = /km/.test(value);
    const raw = isKm ? pKm(value) : pBRL(value);
    const next = Math.max(0, raw + step * sinal);
    if (isKm) return onChange(fKm(next));
    if (isMoney) return onChange(fBRL(next));
    return onChange(fLitros(next));
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pr-12 focus-visible:ring-1 focus-visible:ring-muted-foreground/30 ${
          className || ""
        }`}
      />
      <div className="pointer-events-auto absolute right-1 top-1 flex w-10 select-none flex-col overflow-hidden rounded-md border bg-background shadow-sm">
        <button
          type="button"
          className="h-5 text-xs hover:bg-muted"
          onClick={() => inc(1)}
        >
          ▲
        </button>
        <button
          type="button"
          className="h-5 text-xs hover:bg-muted"
          onClick={() => inc(-1)}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default function RefuelingPage() {
  const { theme } = useTheme();

  // tema
  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const barColor = isDarkMode ? "#60a5fa" : "#2563eb";
  const COLORS = {
    azul: barColor,
    vermelho: "#ef4444",
    verde: "#22c55e",
    laranja: "#f59e0b",
    azulEscuro: "#1e3a8a",
    cinza: "#9ca3af",
  };
  const FUEL_COLORS: Record<string, string> = {
    Gasolina: COLORS.laranja,
    Etanol: COLORS.verde,
    Diesel: COLORS.azulEscuro,
    GNV: "#06b6d4",
    Flex: "#a855f7",
  };

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

  // ===== mocks =====
  const [items, setItems] = useState<Abastecimento[]>([
    {
      id: crypto.randomUUID(),
      odometro: 32500,
      precoLitro: 5.89,
      tipo: "Gasolina",
      valorTotal: 220.0,
      litros: 37.36,
      posto: "Posto Zona Sul",
      motorista: "Artur",
      dataHora: new Date().toISOString(),
      tanqueCompleto: true,
      observacoes: "Tanque cheio",
    },
    {
      id: crypto.randomUUID(),
      odometro: 33120,
      precoLitro: 5.79,
      tipo: "Gasolina",
      valorTotal: 180.0,
      litros: 31.08,
      posto: "Posto Centro",
      motorista: "Artur",
      dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      tanqueCompleto: false,
    },
    {
      id: crypto.randomUUID(),
      odometro: 33780,
      precoLitro: 5.69,
      tipo: "Etanol",
      valorTotal: 160.0,
      litros: 28.13,
      posto: "Posto Barra",
      motorista: "Artur",
      dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
      tanqueCompleto: true,
    },
  ]);

  // ===== form com máscaras =====
  const [form, setForm] = useState({
    odometroMask: fKm(33800),
    precoLitroMask: fBRL(5.79),
    tipo: "Gasolina" as FuelType,
    valorTotalMask: fBRL(200),
    litrosMask: fLitros(34),
    posto: "",
    motorista: "",
    dataHora: new Date().toISOString().slice(0, 16),
    tanqueCompleto: true,
    observacoes: "",
  });

  // ===== KPIs =====
  const kpis = useMemo(() => {
    if (!items.length)
      return {
        totalGasto: 0,
        totalLitros: 0,
        mediaPrecoLitro: 0,
        mediaConsumoKmL: 0,
        kmRodados: 0,
      };
    const sorted = [...items].sort(
      (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );
    const totalGasto = items.reduce((a, b) => a + b.valorTotal, 0);
    const totalLitros = items.reduce((a, b) => a + b.litros, 0);
    const mediaPrecoLitro = totalLitros ? totalGasto / totalLitros : 0;

    let kmAc = 0,
      lAc = 0;
    const cons: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1],
        cur = sorted[i];
      kmAc += Math.max(0, cur.odometro - prev.odometro);
      lAc += cur.litros;
      if (cur.tanqueCompleto) {
        if (kmAc > 0 && lAc > 0) cons.push(kmAc / lAc);
        kmAc = 0;
        lAc = 0;
      }
    }
    const mediaConsumoKmL = cons.length
      ? cons.reduce((a, b) => a + b, 0) / cons.length
      : 0;
    const kmRodados =
      sorted.length > 1
        ? Math.max(0, sorted.at(-1)!.odometro - sorted[0].odometro)
        : 0;
    return {
      totalGasto,
      totalLitros,
      mediaPrecoLitro,
      mediaConsumoKmL,
      kmRodados,
    };
  }, [items]);

  // ===== dados dos charts =====
  const chartData = useMemo(() => {
    const byDate = [...items]
      .sort(
        (a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
      )
      .map((it) => ({
        data: format(new Date(it.dataHora), "dd/MM", { locale: ptBR }),
        gasto: it.valorTotal,
        litros: it.litros,
        preco: it.precoLitro,
        odometro: it.odometro,
      }));

    const byMonthMap = new Map<string, { gasto: number; litros: number }>();
    items.forEach((it) => {
      const k = format(new Date(it.dataHora), "MM/yyyy");
      const v = byMonthMap.get(k) || { gasto: 0, litros: 0 };
      v.gasto += it.valorTotal;
      v.litros += it.litros;
      byMonthMap.set(k, v);
    });
    const byMonth = [...byMonthMap.entries()].map(([mes, v]) => ({
      mes,
      ...v,
    }));

    const byFuelMap = new Map<FuelType, number>();
    items.forEach((it) =>
      byFuelMap.set(it.tipo, (byFuelMap.get(it.tipo) || 0) + it.litros)
    );
    const byFuel = [...byFuelMap.entries()].map(([tipo, litros]) => ({
      tipo,
      litros,
    }));

    return { byDate, byMonth, byFuel };
  }, [items]);

  // ===== carrossel =====
  const [idx, setIdx] = useState(0);

  // ===== submit =====
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.parse(form);
    const novo: Abastecimento = {
      id: crypto.randomUUID(),
      odometro: parsed.odometroMask.value,
      precoLitro: parsed.precoLitroMask.value,
      tipo: form.tipo,
      valorTotal: parsed.valorTotalMask.value,
      litros: parsed.litrosMask.value,
      posto: form.posto || "",
      motorista: form.motorista || "",
      dataHora: form.dataHora,
      tanqueCompleto: form.tanqueCompleto,
      observacoes: form.observacoes,
    };
    setItems((old) => [novo, ...old]);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Acompanhamento de Combustível
          </h1>
          <p className="text-sm text-muted-foreground">
            Registre abastecimentos e acompanhe consumo e gastos.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Abastecer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo abastecimento</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-4">
                <Label>Odômetro</Label>
                <InputWithStepper
                  value={form.odometroMask}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      odometroMask: v
                        .replace(/[^0-9]/g, "")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        .concat(" km"),
                    })
                  }
                  step={100}
                  placeholder="000.000 km"
                />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <Label>Preço do litro (R$/L)</Label>
                <InputWithStepper
                  value={form.precoLitroMask}
                  onChange={(v) =>
                    setForm({ ...form, precoLitroMask: fBRL(pBRL(v)) })
                  }
                  step={0.01}
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <Label>Tipo de combustível</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) =>
                    setForm({ ...form, tipo: v as FuelType })
                  }
                >
                  <SelectTrigger className="focus-visible:ring-1 focus-visible:ring-muted-foreground/30">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Etanol">Etanol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="GNV">GNV</SelectItem>
                    <SelectItem value="Flex">Flex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 sm:col-span-4">
                <Label>Valor total (R$)</Label>
                <InputWithStepper
                  value={form.valorTotalMask}
                  onChange={(v) =>
                    setForm({ ...form, valorTotalMask: fBRL(pBRL(v)) })
                  }
                  step={1}
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <Label>Litros (L)</Label>
                <InputWithStepper
                  value={form.litrosMask}
                  onChange={(v) =>
                    setForm({ ...form, litrosMask: fLitros(pLitros(v)) })
                  }
                  step={0.1}
                  placeholder="0,00"
                />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <Label>Posto</Label>
                <Input
                  value={form.posto}
                  onChange={(e) => setForm({ ...form, posto: e.target.value })}
                  className="focus-visible:ring-1 focus-visible:ring-muted-foreground/30"
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <Label>Motorista</Label>
                <Input
                  value={form.motorista}
                  onChange={(e) =>
                    setForm({ ...form, motorista: e.target.value })
                  }
                  className="focus-visible:ring-1 focus-visible:ring-muted-foreground/30"
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <Label>Data e hora</Label>
                <Input
                  type="datetime-local"
                  value={form.dataHora}
                  onChange={(e) =>
                    setForm({ ...form, dataHora: e.target.value })
                  }
                  className="focus-visible:ring-1 focus-visible:ring-muted-foreground/30"
                />
              </div>
              <div className="col-span-12 flex items-center gap-3">
                <Switch
                  checked={form.tanqueCompleto}
                  onCheckedChange={(v) =>
                    setForm({ ...form, tanqueCompleto: v })
                  }
                />
                <Label>Tanque completo</Label>
              </div>
              <div className="col-span-12">
                <Label>Observações</Label>
                <Textarea
                  value={form.observacoes}
                  onChange={(e) =>
                    setForm({ ...form, observacoes: e.target.value })
                  }
                  className="focus-visible:ring-1 focus-visible:ring-muted-foreground/30"
                />
              </div>
              <div className="col-span-12 mt-2 flex justify-end gap-2">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* layout 3 colunas */}
      <div className="grid grid-cols-12 gap-6">
        {/* esquerda – últimos abastecimentos */}
        <div className="col-span-12 xl:col-span-3">
          <Card className="h-[520px] overflow-hidden">
            <CardHeader>
              <CardTitle>Últimos abastecimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 overflow-y-auto pr-2">
              {items.map((it) => (
                <div key={it.id} className="rounded-xl border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {format(new Date(it.dataHora), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                    <span className="text-muted-foreground">{it.tipo}</span>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    <span>{fKm(it.odometro)}</span>
                    <span className="text-right">{fLitros(it.litros)} L</span>
                    <span className="text-muted-foreground">
                      {it.posto || "—"}
                    </span>
                    <span className="text-right">{fBRL(it.valorTotal)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* centro – carrossel de gráficos */}
        <div className="col-span-12 xl:col-span-6">
          <Card className="h-[520px]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {
                  [
                    "Gasto por abastecimento",
                    "Preço por litro ao longo do tempo",
                    "Gasto e litros por mês",
                    "Mix de combustível (litros)",
                  ][idx]
                }
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIdx((i) => (i - 1 + 4) % 4)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIdx((i) => (i + 1) % 4)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[420px]">
              <div className="h-full w-full">
                {/* 0) Gasto por abastecimento – barras azuis */}
                {idx === 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.byDate}
                      margin={{ left: 8, right: 8 }}
                    >
                      <defs>
                        <linearGradient
                          id="barBlue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={COLORS.azul}
                            stopOpacity={0.95}
                          />
                          <stop
                            offset="100%"
                            stopColor={COLORS.azul}
                            stopOpacity={0.45}
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
                      <Tooltip formatter={(v: any) => fBRL(Number(v))} />
                      <Bar dataKey="gasto" name="Gasto" fill="url(#barBlue)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* 1) Preço por litro – AreaChart preenchido */}
                {idx === 1 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData.byDate}
                      margin={{ left: 8, right: 8 }}
                    >
                      <defs>
                        <linearGradient
                          id="priceFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={COLORS.azul}
                            stopOpacity={0.35}
                          />
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
                      <Tooltip formatter={(v: any) => `${fBRL(Number(v))}/L`} />
                      <Area
                        type="monotone"
                        dataKey="preco"
                        name="Preço/L"
                        stroke={COLORS.azul}
                        fill="url(#priceFill)"
                        dot={{ r: 3, stroke: COLORS.azul, strokeWidth: 1 }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {/* 2) Gasto e litros por mês – gasto vermelho, litros azul */}
                {idx === 2 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData.byMonth}
                      margin={{ left: 8, right: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis
                        dataKey="mes"
                        stroke={axisColor}
                        tick={{ fill: axisColor }}
                      />
                      <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                      <Tooltip
                        formatter={(v: any, n: any) =>
                          n === "gasto"
                            ? fBRL(Number(v))
                            : `${fLitros(Number(v))} L`
                        }
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="gasto"
                        name="Gasto"
                        stroke={COLORS.vermelho}
                        fill={COLORS.vermelho}
                        fillOpacity={0.25}
                      />
                      <Area
                        type="monotone"
                        dataKey="litros"
                        name="Litros"
                        stroke={COLORS.azul}
                        fill={COLORS.azul}
                        fillOpacity={0.18}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {/* 3) Mix – cores por combustível */}
                {idx === 3 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(v: any) => `${fLitros(Number(v))} L`}
                      />
                      <Legend />
                      <Pie
                        data={chartData.byFuel}
                        dataKey="litros"
                        nameKey="tipo"
                        outerRadius={140}
                        label
                      >
                        {chartData.byFuel.map((d, i) => (
                          <Cell
                            key={i}
                            fill={FUEL_COLORS[d.tipo] ?? COLORS.cinza}
                            stroke={isDarkMode ? "#111827" : "#ffffff"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* direita – KPIs */}
        <div className="col-span-12 xl:col-span-3">
          <div className="grid h-[520px] grid-rows-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gasto total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {fBRL(kpis.totalGasto)}
                </div>
                <p className="text-sm text-muted-foreground">
                  No período registrado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Média de consumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {kpis.mediaConsumoKmL > 0
                    ? `${kpis.mediaConsumoKmL.toFixed(2)} km/L`
                    : "—"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Ciclos de tanque cheio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Litros e km</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {fLitros(kpis.totalLitros)} L
                </div>
                <p className="text-sm text-muted-foreground">
                  {kpis.kmRodados > 0
                    ? `${kpis.kmRodados.toLocaleString("pt-BR")} km rodados`
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
