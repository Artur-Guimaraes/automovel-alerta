import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/theme-provider";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Vehicle {
  id: number;
  name: string;
}

interface Maintenance {
  id: number;
  vehicleId: number;
  type: string;
  date: string;
  mileage: number;
  cost: string;
  status: "Pendente" | "Concluído" | "Próximo a vencer";
}

export function Maintenance() {
  const { theme } = useTheme(); // Detecta o tema atual
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  
  useEffect(() => {
    setVehicles([
      { id: 1, name: "Meu Peugeot" },
      { id: 2, name: "SUV Família" },
    ]);
  }, []);

  useEffect(() => {
    setMaintenances([
      { id: 1, vehicleId: 1, type: "Troca de Óleo", date: "2024-01-15", mileage: 32000, cost: "R$ 200,00", status: "Concluído" },
      { id: 2, vehicleId: 1, type: "Alinhamento", date: "2024-02-10", mileage: 35000, cost: "R$ 150,00", status: "Pendente" },
      { id: 3, vehicleId: 1, type: "Troca de Filtros", date: "2024-03-01", mileage: 38000, cost: "R$ 180,00", status: "Próximo a vencer" },
      { id: 4, vehicleId: 2, type: "Revisão Completa", date: "2024-01-20", mileage: 45000, cost: "R$ 750,00", status: "Concluído" },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-500 text-white";
      case "Concluído":
        return "bg-green-500 text-white";
      case "Próximo a vencer":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredMaintenances = maintenances.filter((maintenance) => maintenance.vehicleId === selectedVehicle);
  const mileageData = filteredMaintenances.map((maintenance) => ({
    date: format(new Date(maintenance.date), "dd/MM"),
    mileage: maintenance.mileage,
  }));

  // Definição de cores baseadas no tema
  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const lineColor = isDarkMode ? "#60a5fa" : "#2563eb";
  const tooltipBg = isDarkMode ? "#1f2937" : "#ffffff";
  const tooltipText = isDarkMode ? "#f9fafb" : "#000000";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Histórico de Manutenções</h1>

      <div className="mb-6 flex justify-center">
        <Select onValueChange={(value) => setSelectedVehicle(Number(value))}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione um veículo" />
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

      {selectedVehicle && (
        <>
          {filteredMaintenances.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhuma manutenção encontrada para este veículo.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaintenances.map((maintenance) => (
                <Card key={maintenance.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{maintenance.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Data: <span className="font-medium">{format(new Date(maintenance.date), "dd/MM/yyyy")}</span></p>
                    <p className="text-sm text-gray-500">Quilometragem: <span className="font-medium">{maintenance.mileage} km</span></p>
                    <p className="text-sm text-gray-500">Custo: <span className="font-medium">{maintenance.cost}</span></p>
                    <Badge className={`${getStatusColor(maintenance.status)} mt-2`}>{maintenance.status}</Badge>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Excluir</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Evolução da Quilometragem</h2>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
              {mileageData.length > 1 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mileageData}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke={axisColor} />
                    <YAxis stroke={axisColor} />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
                    <Line type="monotone" dataKey="mileage" stroke={lineColor} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center">Dados insuficientes para exibir o gráfico.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};