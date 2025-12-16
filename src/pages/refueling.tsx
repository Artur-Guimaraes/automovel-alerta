import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

import { api } from "@/lib/api";
import {
  createRefueling,
  deleteRefueling,
  getRefuelingMetrics,
  listRefuelings,
  type Refueling,
} from "@/services/refueling.service";

// utils
const fBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Vehicle = { id: number; name: string };

const FUEL_LABELS: Record<string, string> = {
  GASOLINA: "Gasolina",
  GASOLINA_ADITIVADA: "Gasolina Aditivada",
  ETANOL: "Etanol",
  DIESEL: "Diesel",
};

const CHOICES = [
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "180d", label: "Últimos 180 dias" },
  { value: "365d", label: "Últimos 12 meses" },
] as const;

type CalcResult =
  | {
      mode: "data";
      winner: "GASOLINA" | "ETANOL" | null;
      effGas: number | null;
      effEta: number | null;
      costKmGas: number | null;
      costKmEta: number | null;
      tip?: never;
    }
  | {
      mode: "fallback";
      winner: "GASOLINA" | "ETANOL" | null;
      tip: string;
      effGas: null;
      effEta: null;
      costKmGas: null;
      costKmEta: null;
    };

export default function RefuelingPage() {
  const qc = useQueryClient();

  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [range, setRange] = useState<"30d" | "90d" | "180d" | "365d">("90d");

  // form abastecimento
  const [liters, setLiters] = useState<string>("");
  const [pricePerLiter, setPricePerLiter] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("GASOLINA");
  const [mileage, setMileage] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  });

  // vehicles
  const vehiclesQ = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data } = await api.get<Vehicle[]>("/api/vehicles");
      return data;
    },
  });

  useEffect(() => {
    if (vehiclesQ.data && vehiclesQ.data.length && vehicleId == null) {
      setVehicleId(vehiclesQ.data[0].id);
    }
  }, [vehiclesQ.data, vehicleId]);

  // lista de abastecimentos do veículo
  const listQ = useQuery({
    queryKey: ["refuelings:list", vehicleId],
    queryFn: () => listRefuelings(vehicleId!),
    enabled: !!vehicleId,
  });

  // métricas (usadas pela calculadora)
  const metricsQ = useQuery({
    queryKey: ["refuelings:metrics", vehicleId, range],
    queryFn: () => getRefuelingMetrics(vehicleId!, range),
    enabled: !!vehicleId,
  });

  // mutations
  const createMut = useMutation({
    mutationFn: createRefueling,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["refuelings:list", vehicleId] });
      qc.invalidateQueries({ queryKey: ["refuelings:metrics", vehicleId] });
      // limpa form
      setLiters("");
      setPricePerLiter("");
      setFuelType("GASOLINA");
      setMileage("");
      const now = new Date();
      setDateStr(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(now.getDate()).padStart(2, "0")}`
      );
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteRefueling(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["refuelings:list", vehicleId] });
      qc.invalidateQueries({ queryKey: ["refuelings:metrics", vehicleId] });
    },
  });

  // total estimado do form
  const estimatedTotal = useMemo(() => {
    const l = Number(String(liters).replace(",", "."));
    const p = Number(String(pricePerLiter).replace(",", "."));
    if (isNaN(l) || isNaN(p)) return 0;
    return l * p;
  }, [liters, pricePerLiter]);

  // helpers de máscara simples
  const kmMask = (s: string) => {
    const digits = s.replace(/\D/g, "");
    const n = digits ? parseInt(digits, 10) : 0;
    return n.toLocaleString("pt-BR");
  };

  function addRefueling() {
    if (!vehicleId) return;
    const kmNum = Number(mileage.replace(/\./g, "")); // tira separadores
    if (!kmNum && kmNum !== 0) return;

    createMut.mutate({
      vehicleId,
      liters,
      pricePerLiter,
      date: dateStr,
      fuelType,
      mileage: kmNum, // <<< manda km obrigatório
    });
  }

  // ================== CALCULADORA GASOLINA x ETANOL ==================
  const [priceGas, setPriceGas] = useState<string>("");
  const [priceEta, setPriceEta] = useState<string>("");
  const [result, setResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    if (!metricsQ.data) {
      setResult(null);
      return;
    }
    const { byFuelType } = metricsQ.data;
    const g = byFuelType["GASOLINA"] || byFuelType["GASOLINA_ADITIVADA"];
    const e = byFuelType["ETANOL"];
    if (g && g.liters > 0)
      setPriceGas((g.cost / g.liters).toFixed(2).replace(".", ","));
    else setPriceGas("");
    if (e && e.liters > 0)
      setPriceEta((e.cost / e.liters).toFixed(2).replace(".", ","));
    else setPriceEta("");
    setResult(null);
  }, [metricsQ.data, vehicleId, range]);

  const toNum = (s: string) =>
    Number(
      String(s || "0")
        .replace(/\./g, "")
        .replace(",", ".")
    );

  const handleCalculate = () => {
    const m = metricsQ.data;
    if (!m) return setResult(null);

    const priceG = toNum(priceGas);
    const priceE = toNum(priceEta);

    // se não houver km calculado (a API já faz com mileage), cai no fallback
    if (m.kmDriven == null || m.kmDriven <= 0 || m.liters <= 0) {
      const ratio = priceE > 0 && priceG > 0 ? priceE / priceG : NaN;
      const tip =
        isFinite(ratio) && !isNaN(ratio)
          ? ratio <= 0.7
            ? "Pelo preço atual, Etanol está ≤ 70% do preço da Gasolina (tende a compensar)."
            : "Etanol está > 70% do preço da Gasolina (Gasolina tende a compensar)."
          : "Digite os preços para comparar (regra dos 70%).";
      const winner =
        isFinite(ratio) && !isNaN(ratio)
          ? ratio <= 0.7
            ? "ETANOL"
            : "GASOLINA"
          : null;

      setResult({
        mode: "fallback",
        winner,
        tip,
        effGas: null,
        effEta: null,
        costKmGas: null,
        costKmEta: null,
      });
      return;
    }

    const effGeral = m.avgKmPerL ?? null;

    const costKmGas =
      effGeral && effGeral > 0 && priceG > 0 ? priceG / effGeral : null;
    const costKmEta =
      effGeral && effGeral > 0 && priceE > 0 ? priceE / effGeral : null;

    let winner: "GASOLINA" | "ETANOL" | null = null;
    if (costKmGas != null && costKmEta != null) {
      winner = costKmGas <= costKmEta ? "GASOLINA" : "ETANOL";
    }

    setResult({
      mode: "data",
      winner,
      effGas: effGeral,
      effEta: effGeral,
      costKmGas,
      costKmEta,
    });
  };
  // ===================================================================

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Abastecimentos</h1>

      {/* seletor de veículo */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <Label className="w-24">Veículo</Label>
          <Select
            value={vehicleId ? String(vehicleId) : undefined}
            onValueChange={(v) => setVehicleId(Number(v))}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              {(vehiclesQ.data ?? []).map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Período</span>
          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHOICES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CALCULADORA */}
      {vehicleId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Qual compensa abastecer?</CardTitle>
          </CardHeader>
          <CardContent>
            {metricsQ.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Carregando dados do veículo…
              </p>
            ) : metricsQ.isError ? (
              <p className="text-sm text-red-400">
                Não foi possível obter as métricas agora.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>Preço atual da Gasolina (R$/L)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="0,00"
                      value={priceGas}
                      onChange={(e) => setPriceGas(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Preço atual do Etanol (R$/L)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="0,00"
                      value={priceEta}
                      onChange={(e) => setPriceEta(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Button onClick={handleCalculate} disabled={!vehicleId}>
                    Calcular
                  </Button>
                </div>

                <Separator className="my-4" />

                {!result ? (
                  <div className="rounded-xl border p-3 text-sm text-muted-foreground">
                    Preencha os preços e clique em <b>Calcular</b> para ver a
                    recomendação baseada no seu histórico recente ({range}).
                  </div>
                ) : result.mode === "data" ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Kpi
                      label="Custo por km (Gasolina)"
                      value={
                        result.costKmGas != null ? fBRL(result.costKmGas) : "—"
                      }
                    />
                    <Kpi
                      label="Custo por km (Etanol)"
                      value={
                        result.costKmEta != null ? fBRL(result.costKmEta) : "—"
                      }
                    />
                    <div className="rounded-xl border p-3">
                      <div className="text-sm text-muted-foreground">
                        Recomendação
                      </div>
                      <div className="text-xl font-semibold">
                        {result.winner
                          ? (result.winner === "GASOLINA"
                              ? "Gasolina"
                              : "Etanol") + " compensa mais"
                          : "—"}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Baseado no seu histórico recente ({range}) e nos preços
                        informados.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border p-3">
                    <div className="text-sm text-muted-foreground">
                      Recomendação (fallback)
                    </div>
                    <div className="text-xl font-semibold">
                      {result.winner
                        ? (result.winner === "GASOLINA"
                            ? "Gasolina"
                            : "Etanol") + " compensa mais"
                        : "—"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.tip}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* formulário de novo abastecimento */}
      {vehicleId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Novo abastecimento</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="md:col-span-1">
              <Label>Litros</Label>
              <Input
                inputMode="decimal"
                placeholder="0,00"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <Label>Preço/L</Label>
              <Input
                inputMode="decimal"
                placeholder="0,00"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <Label>Data</Label>
              <Input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <Label>Combustível</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FUEL_LABELS).map(([val, lab]) => (
                    <SelectItem key={val} value={val}>
                      {lab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NOVO: quilometragem obrigatória, com máscara simples e sufixo visual */}
            <div className="md:col-span-1">
              <Label>Quilometragem</Label>
              <div className="relative">
                <Input
                  inputMode="numeric"
                  placeholder="0"
                  value={mileage}
                  onChange={(e) => setMileage(kmMask(e.target.value))}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  km
                </span>
              </div>
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button
                className="w-full"
                onClick={addRefueling}
                disabled={
                  createMut.isPending ||
                  !mileage.trim() ||
                  !liters.trim() ||
                  !pricePerLiter.trim()
                }
                title={!mileage.trim() ? "Informe a quilometragem" : ""}
              >
                {createMut.isPending ? "Salvando..." : "Adicionar"}
              </Button>
            </div>

            <div className="md:col-span-6 text-sm text-muted-foreground">
              Total estimado:{" "}
              <span className="font-medium">{fBRL(estimatedTotal)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* lista de abastecimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {listQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : listQ.data && listQ.data.length > 0 ? (
            listQ.data
              .slice()
              .sort((a, b) => b.date - a.date)
              .map((r) => (
                <RefuelItem key={r.id} r={r} onDelete={deleteMut.mutate} />
              ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum abastecimento encontrado.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RefuelItem({
  r,
  onDelete,
}: {
  r: Refueling;
  onDelete: (id: number) => void;
}) {
  const dt = new Date(r.date * 1000);
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">
          {String(dt.getDate()).padStart(2, "0")}/
          {String(dt.getMonth() + 1).padStart(2, "0")}/{dt.getFullYear()}
        </div>
        <div className="text-sm">
          {r.liters.toFixed(2)} L × {fBRL(r.pricePerLiter)} ={" "}
          <span className="font-medium">{fBRL(r.total)}</span>
        </div>
        {r.mileage != null && (
          <div className="text-xs text-muted-foreground">
            Odômetro: {Number(r.mileage).toLocaleString("pt-BR")} km
          </div>
        )}
        {r.fuelType && (
          <div className="text-xs text-muted-foreground">
            Combustível: {FUEL_LABELS[r.fuelType] ?? r.fuelType}
          </div>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir abastecimento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(r.id)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
