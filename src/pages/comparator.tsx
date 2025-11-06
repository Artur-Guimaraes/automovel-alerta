import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  getVehicleKpis,
  listVehicles,
  pickTwoMostRecentVehicleIds,
  type CombinedKpis,
  type Vehicle,
} from "@/services/comparator.service";

const CHOICES = [
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "180d", label: "Últimos 180 dias" },
  { value: "365d", label: "Últimos 12 meses" },
] as const;

const fBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Comparator() {
  const vehiclesQ = useQuery({
    queryKey: ["vehicles"],
    queryFn: listVehicles,
  });

  const [range, setRange] = useState<"30d" | "90d" | "180d" | "365d">("90d");
  const [leftId, setLeftId] = useState<number | null>(null);
  const [rightId, setRightId] = useState<number | null>(null);

  // escolhe dois mais recentes por atividade como padrão
  useEffect(() => {
    (async () => {
      if (!vehiclesQ.data) return;
      if (vehiclesQ.data.length === 1) {
        setLeftId(vehiclesQ.data[0].id);
        setRightId(null);
        return;
      }
      const picks = await pickTwoMostRecentVehicleIds();
      if (picks.length >= 2) {
        setLeftId(picks[0]);
        setRightId(picks[1]);
      } else if (vehiclesQ.data.length >= 2) {
        setLeftId(vehiclesQ.data[0].id);
        setRightId(vehiclesQ.data[1].id);
      }
    })();
  }, [vehiclesQ.data]);

  const leftQ = useQuery({
    queryKey: ["cmp:kpis", leftId, range],
    queryFn: () => getVehicleKpis(leftId!, range),
    enabled: !!leftId,
  });

  const rightQ = useQuery({
    queryKey: ["cmp:kpis", rightId, range],
    queryFn: () => getVehicleKpis(rightId!, range),
    enabled: !!rightId,
  });

  const vehicles = vehiclesQ.data ?? [];

  const leftName = useMemo(
    () => vehicles.find((v) => v.id === leftId)?.name ?? "—",
    [vehicles, leftId]
  );
  const rightName = useMemo(
    () => vehicles.find((v) => v.id === rightId)?.name ?? "—",
    [vehicles, rightId]
  );

  const rows: {
    label: string;
    format: (v: any) => string;
    betterIs: "higher" | "lower"; // como decidir verde/vermelho
    left?: (k: CombinedKpis) => number | null;
    right?: (k: CombinedKpis) => number | null;
  }[] = [
    {
      label: "Quilometragem rodada no período",
      format: (v) => (v == null ? "—" : `${v.toFixed(0)} km`),
      betterIs: "higher",
      left: (k) => (k.kmDriven == null ? null : k.kmDriven),
      right: (k) => (k.kmDriven == null ? null : k.kmDriven),
    },
    {
      label: "Consumo médio (km/L)",
      format: (v) => (v == null ? "—" : `${v.toFixed(2)} km/L`),
      betterIs: "higher",
      left: (k) => (k.avgKmPerL == null ? null : k.avgKmPerL),
      right: (k) => (k.avgKmPerL == null ? null : k.avgKmPerL),
    },
    {
      label: "Custo por km",
      format: (v) => (v == null ? "—" : fBRL(v)),
      betterIs: "lower",
      left: (k) => (k.costPerKm == null ? null : k.costPerKm),
      right: (k) => (k.costPerKm == null ? null : k.costPerKm),
    },
    {
      label: "Litros consumidos",
      format: (v) => `${v.toFixed(2)} L`,
      betterIs: "lower",
      left: (k) => k.liters,
      right: (k) => k.liters,
    },
    {
      label: "Abastecimentos",
      format: (v) => String(v),
      betterIs: "lower",
      left: (k) => k.fillups,
      right: (k) => k.fillups,
    },
    {
      label: "Preço médio do litro",
      format: fBRL,
      betterIs: "lower",
      left: (k) => k.avgPricePerLiter,
      right: (k) => k.avgPricePerLiter,
    },
    {
      label: "Gasto com combustível",
      format: fBRL,
      betterIs: "lower",
      left: (k) => k.fuelCost,
      right: (k) => k.fuelCost,
    },
    {
      label: "Gasto com manutenção",
      format: fBRL,
      betterIs: "lower",
      left: (k) => k.maintCost,
      right: (k) => k.maintCost,
    },
    {
      label: "Outros gastos",
      format: fBRL,
      betterIs: "lower",
      left: (k) => k.otherCost,
      right: (k) => k.otherCost,
    },
    {
      label: "Gasto total no período",
      format: fBRL,
      betterIs: "lower",
      left: (k) => k.totalCost,
      right: (k) => k.totalCost,
    },
  ];

  function cellClass(
    a: number | null | undefined,
    b: number | null | undefined,
    betterIs: "higher" | "lower",
    side: "L" | "R"
  ) {
    if (a == null || b == null) return "text-foreground";
    if (a === b) return "text-foreground";
    if (betterIs === "higher") {
      const betterLeft = a > b;
      return side === "L"
        ? betterLeft
          ? "text-green-500 font-medium"
          : "text-red-500"
        : !betterLeft
        ? "text-green-500 font-medium"
        : "text-red-500";
    } else {
      const betterLeft = a < b;
      return side === "L"
        ? betterLeft
          ? "text-green-500 font-medium"
          : "text-red-500"
        : !betterLeft
        ? "text-green-500 font-medium"
        : "text-red-500";
    }
  }

  const bothLoaded = leftQ.data && rightQ.data;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Comparador de Veículos</h1>

      {/* ALERTA se só tiver 1 veículo */}
      {vehiclesQ.data && vehiclesQ.data.length < 2 && (
        <Alert className="mb-6">
          <AlertTitle>Você só possui um veículo cadastrado.</AlertTitle>
          <AlertDescription>
            Para usar o comparador é necessário ter pelo menos dois veículos.
            Cadastre um novo em <b>Meus Veículos</b> e volte aqui.
          </AlertDescription>
        </Alert>
      )}

      {/* Seletores */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Selecione os veículos e o período</CardTitle>
          <div className="flex items-center gap-3">
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Veículo A
              </div>
              <Select
                value={leftId ? String(leftId) : undefined}
                onValueChange={(v) => setLeftId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Veículo B
              </div>
              <Select
                value={rightId ? String(rightId) : undefined}
                onValueChange={(v) => setRightId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
          </div>
        </CardContent>
      </Card>

      {/* TABELA DE COMPARAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo</CardTitle>
        </CardHeader>
        <CardContent>
          {!leftId || !rightId ? (
            <p className="text-sm text-muted-foreground">
              Selecione dois veículos para comparar.
            </p>
          ) : !bothLoaded ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 border-b pb-3">
                <div className="text-sm text-muted-foreground">Métrica</div>
                <div className="text-sm font-medium">{leftName}</div>
                <div className="text-sm font-medium">{rightName}</div>
              </div>

              <div className="mt-2 space-y-3">
                {rows.map((r) => {
                  const lVal = r.left!(leftQ.data!);
                  const rVal = r.right!(rightQ.data!);
                  return (
                    <div
                      key={r.label}
                      className="grid grid-cols-3 gap-4 items-center"
                    >
                      <div className="text-sm text-muted-foreground">
                        {r.label}
                      </div>
                      <div
                        className={`text-sm ${cellClass(
                          lVal,
                          rVal,
                          r.betterIs,
                          "L"
                        )}`}
                      >
                        {lVal == null ? "—" : r.format(lVal)}
                      </div>
                      <div
                        className={`text-sm ${cellClass(
                          lVal,
                          rVal,
                          r.betterIs,
                          "R"
                        )}`}
                      >
                        {rVal == null ? "—" : r.format(rVal)}
                      </div>
                    </div>
                  );
                })}

                <Separator className="my-3" />

                {/* Combustível dominante no período (informativo) */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-sm text-muted-foreground">
                    Combustível predominante
                  </div>
                  <div className="text-sm">
                    {prettyFuel(leftQ.data!.dominantFuel)}
                  </div>
                  <div className="text-sm">
                    {prettyFuel(rightQ.data!.dominantFuel)}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function prettyFuel(code?: string | null) {
  if (!code) return "—";
  const map: Record<string, string> = {
    GASOLINA: "Gasolina",
    GASOLINA_ADITIVADA: "Gasolina Aditivada",
    ETANOL: "Etanol",
    DIESEL: "Diesel",
  };
  return map[code] ?? code;
}
