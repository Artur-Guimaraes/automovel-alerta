import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { getDashboard } from "@/services/dashboard.service";
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

export function Home() {
  const { theme } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const vehicles = data?.vehicles ?? [];
  const recentMaintenances = data?.recentMaintenances ?? [];

  const totalVehicles = data?.vehiclesCount ?? 0;
  // Mantemos o card “Próximas Manutenções” mostrando uma contagem útil com os dados disponíveis
  const pendingMaintenancesCount = recentMaintenances.length;

  const lastMaintenance = useMemo(() => {
    if (!recentMaintenances.length) return null;
    const m = [...recentMaintenances].sort((a, b) => b.date - a.date)[0];
    return {
      title: m.title,
      date: new Date(m.date * 1000).toLocaleDateString("pt-BR"),
    };
  }, [recentMaintenances]);

  const mileageData = useMemo(
    () => vehicles.map((v) => ({ name: v.name, mileage: v.mileage ?? 0 })),
    [vehicles]
  );

  const maintCostSeries = useMemo(
    () =>
      recentMaintenances
        .slice()
        .sort((a, b) => a.date - b.date)
        .map((m) => ({
          date: new Date(m.date * 1000).toLocaleDateString("pt-BR"),
          cost: Number(m.cost ?? 0),
        })),
    [recentMaintenances]
  );

  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const barColor = isDarkMode ? "#60a5fa" : "#2563eb";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">Carregando…</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
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
            <p className="text-3xl font-bold">{pendingMaintenancesCount}</p>
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
                <p className="text-lg font-semibold">{lastMaintenance.title}</p>
                <p className="text-gray-500 text-sm">{lastMaintenance.date}</p>
              </>
            ) : (
              <p className="text-gray-500">Nenhuma manutenção encontrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
              <LineChart data={maintCostSeries}>
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
      </div>
    </div>
  );
}
