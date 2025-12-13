import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// services
import {
  listVehicles,
  type Vehicle as VehicleRow,
} from "@/services/vehicle.service";
import {
  listMaintenances,
  type Maintenance as MaintenanceRow,
} from "@/services/maintenance.service";
import {
  getRefuelingMetrics,
  type RefuelingMetrics,
} from "@/services/refueling.service";

function fBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const barColor = isDarkMode ? "#60a5fa" : "#2563eb";

  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [maintenances, setMaintenances] = useState<MaintenanceRow[]>([]);

  // KPIs de combustível por período
  const [range, setRange] = useState<"30d" | "60d" | "90d" | "180d" | "365d">(
    "90d"
  );
  const [fuelMetrics, setFuelMetrics] = useState<RefuelingMetrics | null>(null);

  // carregar veículos e selecionar o primeiro
  useEffect(() => {
    (async () => {
      const v = await listVehicles();
      setVehicles(v);
      if (v.length) setSelectedVehicleId(v[0].id);
    })();
  }, []);

  // carregar manutenções e métricas ao trocar veículo/range
  useEffect(() => {
    if (!selectedVehicleId) return;
    (async () => {
      const [m, metrics] = await Promise.all([
        listMaintenances(selectedVehicleId),
        getRefuelingMetrics(selectedVehicleId, range),
      ]);
      setMaintenances(m);
      setFuelMetrics(metrics);
    })();
  }, [selectedVehicleId, range]);

  const toEpochSec = (value: number | string | Date): number => {
    if (typeof value === "number") return value;
    const dt = new Date(value);
    return Math.floor(dt.getTime() / 1000) || 0;
  };

  const nowSec = Math.floor(Date.now() / 1000);

  const totalVehicles = vehicles.length;

  // Próximas manutenções = datas futuras
  const pendingMaintenances = useMemo(
    () =>
      maintenances.filter((maintenance: any) => {
        const maintenanceDate = toEpochSec(maintenance.date);
        return maintenanceDate >= nowSec;
      }),
    [maintenances, nowSec]
  );

  // Última manutenção = última com data <= hoje
  const lastMaintenance = useMemo(() => {
    const past = maintenances.filter((m: any) => {
      const maintenanceDate = toEpochSec(m.date);
      return maintenanceDate <= nowSec;
    });
    return past.sort(
      (a: any, b: any) => toEpochSec(b.date) - toEpochSec(a.date)
    )[0];
  }, [maintenances, nowSec]);

  // Para o gráfico de quilometragem por veículo
  const mileageData = vehicles.map((vehicle) => ({
    name: vehicle.name,
    mileage: Number(vehicle.mileage ?? 0),
  }));

  // Gráfico de gastos com manutenção (somente do veículo selecionado)
  const maintenanceCostSeries = (maintenances || [])
    .filter((m) =>
      selectedVehicleId ? m.vehicleId === selectedVehicleId : true
    )
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map((maintenance) => {
      const dateObj = new Date(
        typeof maintenance.date === "number"
          ? maintenance.date * 1000
          : maintenance.date
      );
      return {
        // DD/MM/AA
        date: dateObj.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
        cost: Number(maintenance.cost ?? 0),
      };
    });

  return (
    <div className="flex flex-col min-h-screen gap-6">
      {/* Cabeçalho com seletor de veículo e período dos KPIs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resumo</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral dos seus veículos e custos.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Veículo</div>
            <Select
              value={selectedVehicleId?.toString() ?? ""}
              onValueChange={(value) =>
                setSelectedVehicleId(value ? Number(value) : null)
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue
                  placeholder={
                    vehicles.length ? "Selecione um veículo" : "Sem veículos"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Período</div>
            <Select
              value={range}
              onValueChange={(value) =>
                setRange(value as "30d" | "60d" | "90d" | "180d" | "365d")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="60d">Últimos 60 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="180d">Últimos 180 dias</SelectItem>
                <SelectItem value="365d">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cards superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1 - Veículos cadastrados */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 text-center">
            <CardTitle>Veículos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center">
            <p className="text-3xl font-bold">{totalVehicles}</p>
          </CardContent>
        </Card>

        {/* 2 - Próximas manutenções */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 text-center">
            <CardTitle>Próximas Manutenções</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center">
            <p className="text-3xl font-bold">{pendingMaintenances.length}</p>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => {
                if (selectedVehicleId) {
                  navigate(`/app/maintenance?vehicleId=${selectedVehicleId}`);
                } else {
                  navigate("/maintenance");
                }
              }}
            >
              Ver todas
            </Button>
          </CardContent>
        </Card>

        {/* 3 - Última manutenção */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 text-center">
            <CardTitle>Última Manutenção</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center text-center">
            {lastMaintenance ? (
              <>
                <p className="text-lg font-semibold">
                  {lastMaintenance.title ?? "Manutenção"}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(
                    typeof lastMaintenance.date === "number"
                      ? lastMaintenance.date * 1000
                      : lastMaintenance.date
                  ).toLocaleDateString("pt-BR")}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Nenhuma manutenção concluída</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dois gráficos lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de km por veículo */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Quilometragem dos Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mileageData}>
                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip
                  formatter={(value) => [`${value} km`, "Quilometragem"]}
                  labelFormatter={(label) => `Veículo: ${label}`}
                />
                <Bar dataKey="mileage" fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de gastos com manutenção */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Gastos com Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maintenanceCostSeries}>
                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} />
                <YAxis
                  stroke={axisColor}
                  tickFormatter={(value) => fBRL(Number(value))}
                />
                <Tooltip
                  formatter={(value) => [fBRL(Number(value)), "Custo"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke={barColor}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* KPIs horizontais */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                KPIs de Consumo e Custos{" "}
                {selectedVehicleId ? "" : "(selecione um veículo)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Consumo médio */}
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">
                    Consumo médio
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {fuelMetrics?.avgKmPerL != null
                      ? `${fuelMetrics.avgKmPerL.toFixed(2)} km/L`
                      : "—"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Período: {range.toUpperCase()}
                  </div>
                </div>

                {/* Custo por km */}
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">
                    Custo por km
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {fuelMetrics?.costPerKm != null
                      ? fBRL(fuelMetrics.costPerKm)
                      : "—"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Litros: {fuelMetrics?.liters?.toFixed(2) ?? "—"}
                  </div>
                </div>

                {/* Gasto com combustível */}
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">
                    Gasto com combustível
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {fuelMetrics ? fBRL(fuelMetrics.fuelCost) : "—"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Preço médio/L:{" "}
                    {fuelMetrics ? fBRL(fuelMetrics.avgPricePerLiter) : "—"}
                  </div>
                </div>

                {/* Km rodados (estimado) */}
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">
                    Km rodados (estimado)
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {fuelMetrics?.kmDriven != null
                      ? `${fuelMetrics.kmDriven} km`
                      : "—"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Abastecimentos: {fuelMetrics?.fillups ?? "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
