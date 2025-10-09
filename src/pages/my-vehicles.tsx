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
import { z } from "zod";

import {
  listVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  type Vehicle as VehicleRow,
  type VehicleInput,
} from "@/services/vehicle.service";

/* ------------------------ helpers de formatação ------------------------ */
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const formatKm = (n?: number) =>
  n === undefined || n === null
    ? ""
    : `${Math.max(0, Math.floor(n)).toLocaleString("pt-BR")} km`;
const maskKmInput = (raw: string) => {
  const digits = onlyDigits(raw);
  const num = digits ? parseInt(digits, 10) : 0;
  return { num, text: formatKm(num) };
};
const km = (n: number) => `${n.toLocaleString("pt-BR")} km`;

/* ------------------------------ Zod schema ----------------------------- */
const vehicleSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Informe um nome")
    .max(30, "Nome deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9\s]+$/, "Nome não pode conter caracteres especiais"),
  model: z
    .string()
    .min(1, "Informe o modelo")
    .max(30, "Modelo deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9\s]+$/, "Modelo não pode conter caracteres especiais"),
  plate: z
    .string()
    .transform((v) => v.toUpperCase().replace("-", ""))
    .refine(
      (v) =>
        /^[A-Z]{3}\d{4}$/.test(v) || // AAA1234
        /^[A-Z]{3}\d[A-Z]\d{2}$/.test(v), // AAA1A23
      "Placa inválida"
    ),
  mileage: z.preprocess(
    (v) => Number(String(v).replace(/[^\d.-]/g, "")),
    z.number().nonnegative("Quilometragem deve ser um número válido")
  ),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

export function MyVehicles() {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<VehicleForm | null>(
    null
  );
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleRow | null>(
    null
  );
  const [addingVehicle, setAddingVehicle] = useState<VehicleForm | null>(null);

  // estados visuais para a máscara de km
  const [addingMileageText, setAddingMileageText] = useState<string>("");
  const [editingMileageText, setEditingMileageText] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* -------------------------- carregar da API -------------------------- */
  async function reloadVehicles() {
    const data = await listVehicles();
    setVehicles(data);
  }

  useEffect(() => {
    reloadVehicles().catch((e) =>
      console.error("Failed to fetch vehicles:", e)
    );
  }, []);

  /* ------------------------- handlers principais ----------------------- */
  const handleEditVehicle = (vehicle: VehicleRow) => {
    setErrorMessage(null);
    setEditingVehicle({ ...vehicle });
    setEditingMileageText(formatKm(vehicle.mileage));
  };

  const handleDeleteVehicle = (vehicle: VehicleRow) => {
    setDeletingVehicle(vehicle);
  };

  const confirmDeleteVehicle = async () => {
    if (!deletingVehicle) return;
    try {
      await deleteVehicle(deletingVehicle.id);
      await reloadVehicles();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingVehicle(null);
    }
  };

  const handleAddVehicle = () => {
    setErrorMessage(null);
    setAddingVehicle({
      name: "",
      model: "",
      plate: "",
      mileage: 0,
    });
    setAddingMileageText("");
  };

  async function saveVehicle(payload: VehicleForm, isEdit: boolean) {
    try {
      setErrorMessage(null);
      const parsed = vehicleSchema.parse(payload);

      const input: VehicleInput = {
        name: parsed.name,
        model: parsed.model,
        plate: parsed.plate,
        mileage: parsed.mileage,
      };

      if (isEdit && parsed.id) {
        await updateVehicle(parsed.id, input);
        await reloadVehicles();
        setEditingVehicle(null);
      } else {
        await createVehicle(input);
        await reloadVehicles();
        setAddingVehicle(null);
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao salvar. Verifique os campos.";
      setErrorMessage(msg);
    }
  }

  const handleSaveChanges = async () => {
    if (editingVehicle) {
      await saveVehicle(editingVehicle, true);
    } else if (addingVehicle) {
      await saveVehicle(addingVehicle, false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Meus Veículos</h1>

        <AlertDialog
          open={!!addingVehicle}
          onOpenChange={(o) => !o && setAddingVehicle(null)}
        >
          <AlertDialogTrigger asChild>
            <Button variant={"default"} onClick={handleAddVehicle}>
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
                          plate: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-gray-300">Quilometragem:</label>
                    <Input
                      className="mt-1"
                      type="text"
                      placeholder="km"
                      value={addingMileageText}
                      onChange={(e) => {
                        const { num, text } = maskKmInput(e.target.value);
                        setAddingVehicle({ ...addingVehicle, mileage: num });
                        setAddingMileageText(text);
                      }}
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
                    Modelo: <span className="font-medium">{vehicle.model}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placa: <span className="font-medium">{vehicle.plate}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Quilometragem:{" "}
                    <span className="font-medium">{km(vehicle.mileage)}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Editar */}
                  <AlertDialog
                    open={!!editingVehicle && editingVehicle.id === vehicle.id}
                    onOpenChange={(o) => !o && setEditingVehicle(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        Editar
                      </Button>
                    </AlertDialogTrigger>

                    {editingVehicle && editingVehicle.id === vehicle.id && (
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
                            {errorMessage && (
                              <p className="text-red-500">{errorMessage}</p>
                            )}

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
                              <label className="text-gray-300">Modelo:</label>
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
                                    plate: e.target.value.toUpperCase(),
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
                                placeholder="km"
                                value={editingMileageText}
                                onChange={(e) => {
                                  const { num, text } = maskKmInput(
                                    e.target.value
                                  );
                                  setEditingVehicle({
                                    ...editingVehicle,
                                    mileage: num,
                                  });
                                  setEditingMileageText(text);
                                }}
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

                  {/* Excluir */}
                  <AlertDialog
                    open={
                      !!deletingVehicle && deletingVehicle.id === vehicle.id
                    }
                    onOpenChange={(o) => !o && setDeletingVehicle(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        Excluir
                      </Button>
                    </AlertDialogTrigger>

                    {deletingVehicle && deletingVehicle.id === vehicle.id && (
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
