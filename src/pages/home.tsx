import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Vehicle {
  id: number;
  name: string;
  mileage: number;
}

interface Maintenance {
  id: number;
  vehicleId: number;
  type: string;
  date: string;
  cost: string;
  status: "Pendente" | "Concluído" | "Próximo a vencer";
}

export function Home() {

  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  
  useEffect(() => {
    setVehicles([
      { id: 1, name: "Meu Peugeot", mileage: 38000 },
      { id: 2, name: "SUV Família", mileage: 45000 },
      { id: 3, name: "Compacto da Cidade", mileage: 29000 },
    ]);
  }, []);

  useEffect(() => {
    setMaintenances([
      { id: 1, vehicleId: 1, type: "Troca de Óleo", date: "2024-03-01", cost: "R$ 200,00", status: "Concluído" },
      { id: 2, vehicleId: 1, type: "Troca de Filtros", date: "2024-04-10", cost: "R$ 150,00", status: "Próximo a vencer" },
      { id: 3, vehicleId: 2, type: "Revisão Completa", date: "2024-02-20", cost: "R$ 750,00", status: "Concluído" },
      { id: 4, vehicleId: 3, type: "Alinhamento", date: "2024-05-01", cost: "R$ 180,00", status: "Pendente" },
    ]);
  }, []);

  const totalVehicles = vehicles.length;
  const pendingMaintenances = maintenances.filter(maintenance => maintenance.status === "Pendente" || maintenance.status === "Próximo a vencer");
  const lastMaintenance = maintenances.find(maintenance => maintenance.status === "Concluído");

  const mileageData = vehicles.map(vehicle => ({ name: vehicle.name, mileage: vehicle.mileage }));

  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const barColor = isDarkMode ? "#60a5fa" : "#2563eb";

  return (
    <div className="flex flex-col min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Veículos Cadastrados</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVehicles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximas Manutenções</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingMaintenances.length}</p>
            <Button variant="outline" className="mt-2 w-full">Ver todas</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Última Manutenção</CardTitle></CardHeader>
          <CardContent>
            {lastMaintenance ? (
              <>
                <p className="text-lg font-semibold">{lastMaintenance.type}</p>
                <p className="text-gray-500 text-sm">{lastMaintenance.date}</p>
              </>
            ) : (
              <p className="text-gray-500">Nenhuma manutenção concluída</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <CardHeader><CardTitle>Quilometragem dos Veículos</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Gastos com Manutenção</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maintenances.map(maintenance => ({ date: maintenance.date, cost: parseFloat(maintenance.cost.replace("R$", "").replace(",", ".")) }))}>
                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <Line type="monotone" dataKey="cost" stroke={barColor} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}