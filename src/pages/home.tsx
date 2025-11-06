import { useEffect, useMemo, useState } from "react";
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

  const totalVehicles = vehicles.length;
  const pendingMaintenances = useMemo(
    () =>
      maintenances.filter(
        (maintenance: any) =>
          maintenance.status === "Pendente" ||
          maintenance.status === "Próximo a vencer"
      ),
    [maintenances]
  );

  const lastMaintenance = useMemo(
    () =>
      [...maintenances]
        .filter((m: any) => m) // caso venha vazio
        .sort((a: any, b: any) => Number(b.date) - Number(a.date))[0],
    [maintenances]
  );

  // Para o gráfico de quilometragem por veículo, usamos a mileage que existir nos dados do veículo
  const mileageData = vehicles.map((vehicle) => ({
    name: vehicle.name,
    mileage: Number(vehicle.mileage ?? 0),
  }));

  // para o gráfico de gastos com manutenção, usamos as manutenções do veículo selecionado
  const maintenanceCostSeries = (maintenances || [])
    .filter((m) =>
      selectedVehicleId ? m.vehicleId === selectedVehicleId : true
    )
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map((maintenance) => ({
      date: new Date(
        typeof maintenance.date === "number"
          ? maintenance.date * 1000
          : maintenance.date
      )
        .toISOString()
        .slice(0, 10),
      cost: Number(maintenance.cost ?? 0),
    }));

  return (
    <div className="flex flex-col min-h-screen gap-6">
      {/* Cabeçalho com seletor de veículo e período dos KPIs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Resumo</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral dos seus veículos e custos.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={selectedVehicleId ? String(selectedVehicleId) : undefined}
            onValueChange={(v) => setSelectedVehicleId(Number(v))}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Período" />
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

      {/* Cards superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Veículos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVehicles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingMaintenances.length}</p>
            <Button variant="outline" className="mt-2 w-full">
              Ver todas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Última Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Tooltip />
                <Bar dataKey="mileage" fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Gastos com Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maintenanceCostSeries}>
                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
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

        {/* KPIs horizontais (ocupa a mesma largura das duas caixas dos gráficos) */}
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

              {/* breakdown por tipo de combustível (opcional, compacto) */}
              {fuelMetrics && fuelMetrics.byFuelType && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(fuelMetrics.byFuelType).map(([type, agg]) => (
                    <div key={type} className="rounded-lg border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{type}</span>
                        <span className="text-muted-foreground">
                          {Number(agg.liters).toFixed(2)} L
                        </span>
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {fBRL(Number(agg.cost))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
