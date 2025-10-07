import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { api } from "../lib/api";

import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vehicleSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .max(30, "Nome deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9\s]+$/, "Nome não pode conter caracteres especiais"),
  brand: z
    .string()
    .max(30, "Marca deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9\s]+$/, "Marca não pode conter caracteres especiais"),
  model: z
    .string()
    .max(30, "Modelo deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9\s]+$/, "Modelo não pode conter caracteres especiais"),
  plate: z
    .string()
    .regex(/^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, "Placa inválida"),
  mileage: z
    .string()
    .regex(
      /^\d{1,9} km$/,
      "Quilometragem deve estar no formato correto (ex: 32000 km)"
    ),
});

type VehicleSchema = z.infer<typeof vehicleSchema>;

export function MyVehicles() {
  const [vehicles, setVehicles] = useState<VehicleSchema[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<VehicleSchema | null>(
    null
  );
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleSchema | null>(
    null
  );
  const [addingVehicle, setAddingVehicle] = useState<VehicleSchema | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useEffect(() => {

  //   setVehicles([
  //     {
  //       id: 1,
  //       name: "Meu Peugeot",
  //       brand: "Peugeot",
  //       model: "208 Style 2024",
  //       plate: "ABC-1234",
  //       mileage: "32.500 km",
  //     },
  //     {
  //       id: 2,
  //       name: "SUV Família",
  //       brand: "Jeep",
  //       model: "Compass 2023",
  //       plate: "XYZ-9876",
  //       mileage: "45.200 km",
  //     },
  //   ]);
  // }, []);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const response = await api.get("vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Failed to fetch vehicles: ", error);
      }
    }

    loadVehicles();
  }, []);

  const handleEditVehicle = (vehicle: VehicleSchema) => {
    setEditingVehicle(vehicle);
  };

  const handleDeleteVehicle = (vehicle: VehicleSchema) => {
    setDeletingVehicle(vehicle);
  };

  const confirmDeleteVehicle = () => {
    if (deletingVehicle) {
      setVehicles((prev) => {
        const updatedVehicles = prev.filter(
          (vehicle) => vehicle.id !== deletingVehicle.id
        );
        return updatedVehicles.map((vehicle, index) => ({
          ...vehicle,
          id: index + 1,
        }));
      });
      setDeletingVehicle(null);
    }
  };

  const handleAddVehicle = () => {
    setAddingVehicle({
      id: vehicles.length + 1,
      name: "",
      brand: "",
      model: "",
      plate: "",
      mileage: "",
    });
  };

  const handleSaveChanges = () => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === editingVehicle.id ? editingVehicle : vehicle
        )
      );
      setEditingVehicle(null);
    } else if (addingVehicle) {
      setVehicles((prev) => [...prev, addingVehicle]);
      setAddingVehicle(null);
    }
  };

  useEffect(() => {}, [vehicles]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Meus Veículos</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"default"} onClick={() => handleAddVehicle()}>
              Cadastrar Veículo <Plus />
            </Button>
          </AlertDialogTrigger>
          {addingVehicle && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex justify-between">
                  Adicionar Veículo
                  <AlertDialogCancel onClick={() => setAddingVehicle(null)}>
                    X
                  </AlertDialogCancel>
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  {errorMessage && (
                    <p className="text-red-500">{errorMessage}</p>
                  )}
                  <div>
                    <label className="text-gray-300">Nome do carro:</label>
                    <Input
                      className="mt-1"
                      type="text"
                      value={addingVehicle.name}
                      onChange={(e) =>
                        setAddingVehicle({
                          ...addingVehicle,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300">Marca:</label>
                    <Input
                      className="mt-1"
                      type="text"
                      value={addingVehicle.brand}
                      onChange={(e) =>
                        setAddingVehicle({
                          ...addingVehicle,
                          brand: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300">Modelo:</label>
                    <Input
                      className="mt-1"
                      type="text"
                      value={addingVehicle.model}
                      onChange={(e) =>
                        setAddingVehicle({
                          ...addingVehicle,
                          model: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300">Placa:</label>
                    <Input
                      className="mt-1"
                      type="text"
                      value={addingVehicle.plate}
                      onChange={(e) =>
                        setAddingVehicle({
                          ...addingVehicle,
                          plate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-gray-300">Quilometragem:</label>
                    <Input
                      className="mt-1"
                      type="text"
                      value={addingVehicle.mileage}
                      onChange={(e) =>
                        setAddingVehicle({
                          ...addingVehicle,
                          mileage: e.target.value,
                        })
                      }
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAddingVehicle(null)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveChanges}>
                  Salvar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
      </div>

      {vehicles.length === 0 ? (
        <p className="text-gray-500">Nenhum veículo cadastrado.</p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle>{vehicle.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Marca: <span className="font-medium">{vehicle.brand}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Modelo: <span className="font-medium">{vehicle.model}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placa: <span className="font-medium">{vehicle.plate}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Quilometragem:{" "}
                    <span className="font-medium">{vehicle.mileage}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        Editar
                      </Button>
                    </AlertDialogTrigger>
                    {editingVehicle && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex justify-between">
                            Editar Veículo
                            <AlertDialogCancel
                              onClick={() => setEditingVehicle(null)}
                            >
                              X
                            </AlertDialogCancel>
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <div>
                              <label className="text-gray-300">
                                Nome do carro:
                              </label>
                              <Input
                                className="mt-1"
                                type="text"
                                value={editingVehicle.name}
                                onChange={(e) =>
                                  setEditingVehicle({
                                    ...editingVehicle,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-gray-300">
                                Marca e Modelo:
                              </label>
                              <Input
                                className="mt-1"
                                type="text"
                                value={editingVehicle.model}
                                onChange={(e) =>
                                  setEditingVehicle({
                                    ...editingVehicle,
                                    model: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-gray-300">Placa:</label>
                              <Input
                                className="mt-1"
                                type="text"
                                value={editingVehicle.plate}
                                onChange={(e) =>
                                  setEditingVehicle({
                                    ...editingVehicle,
                                    plate: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-gray-300">
                                Quilometragem:
                              </label>
                              <Input
                                className="mt-1"
                                type="text"
                                value={editingVehicle.mileage}
                                onChange={(e) =>
                                  setEditingVehicle({
                                    ...editingVehicle,
                                    mileage: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setEditingVehicle(null)}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleSaveChanges}>
                            Salvar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    {deletingVehicle && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex justify-between pb-7">
                            Tem certeza que deseja excluir o veículo?
                          </AlertDialogTitle>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setDeletingVehicle(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteVehicle}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogHeader>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
