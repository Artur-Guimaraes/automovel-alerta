import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

import { listVehicles } from "@/services/comparator.service";

// ---------- Tipos ----------
type Vehicle = {
  id: number;
  name: string;
};

// ---------- Presets por veículo----------
const PRESET_ITEMS = [
  { id: "docs", label: "Documentos (CNH, CRLV/CRLV-e, seguro)" },
  { id: "revisao", label: "Revisão em dia / sem luzes de alerta no painel" },
  { id: "pneus", label: "Pneus calibrados + estepe em condições" },
  { id: "macaco", label: "Macaco, chave de roda, triângulo" },
  { id: "freios", label: "Freio e fluido verificados" },
  { id: "agua", label: "Nível de água do radiador e do lavador de para-brisa" },
  { id: "oleo", label: "Nível de óleo do motor" },
  { id: "limpador", label: "Palhetas do limpador" },
  { id: "farol", label: "Faróis, lanternas e setas funcionando" },
  { id: "carregadores", label: "Carregadores de celular / GPS" },
  { id: "pedagio", label: "TAG/Saldo de pedágio e dinheiro trocado" },
  { id: "kit", label: "Kit primeiros socorros e itens pessoais" },
] as const;

// ---------- Helpers de storage ----------
const STORAGE_KEY = "tripChecklist:v1";

type SavedState = {
  [vehicleId: number]: {
    checklist: Record<string, boolean>;
    startOdo?: number; // hodômetro inicial
    plannedKm?: number; // previsto
    endOdo?: number; // hodômetro final
    fuelLiters?: number; // litros gastos na viagem
  };
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : {};
  } catch {
    return {};
  }
}
function saveState(next: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

// mascara simples de km (exibição)
const fmtKm = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + " km"
    : "-";

// ---------- Página ----------
export default function TripChecklist() {
  //Buscar veículos e selecionar o primeiro automaticamente
  const vehiclesQ = useQuery({
    queryKey: ["vehicles"],
    queryFn: listVehicles,
  });

  const vehicles: Vehicle[] = (vehiclesQ.data as any) ?? [];
  const [vehicleId, setVehicleId] = useState<number | null>(null);

  useEffect(() => {
    if (!vehicleId && vehicles.length > 0) {
      setVehicleId(vehicles[0].id);
    }
  }, [vehicles, vehicleId]);

  //Estado por veículo em localStorage
  const [store, setStore] = useState<SavedState>(() => loadState());

  // snapshot do veículo atual
  const vState = useMemo(() => {
    if (!vehicleId) return null;
    return (
      store[vehicleId] ?? {
        checklist: Object.fromEntries(PRESET_ITEMS.map((i) => [i.id, false])),
      }
    );
  }, [store, vehicleId]);

  // handlers para alterar e salvar
  function updateVehicleState(patch: Partial<SavedState[number]>) {
    if (!vehicleId) return;
    setStore((prev) => {
      const next = { ...prev };
      next[vehicleId!] = {
        ...(prev[vehicleId!] ?? { checklist: {} }),
        ...patch,
      };
      saveState(next);
      return next;
    });
  }

  //cálculo da viagem
  const startOdo = vState?.startOdo ?? undefined;
  const plannedKm = vState?.plannedKm ?? undefined;
  const endOdo = vState?.endOdo ?? undefined;
  const fuelLiters = vState?.fuelLiters ?? undefined;

  const tripKm =
    typeof startOdo === "number" && typeof endOdo === "number"
      ? Math.max(0, endOdo - startOdo)
      : undefined;

  const kmPerLiter =
    typeof tripKm === "number" &&
    typeof fuelLiters === "number" &&
    fuelLiters > 0
      ? tripKm / fuelLiters
      : undefined;

  return (
    <div className="mx-auto max-w-[1100px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Checklist de viagem</h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>

        <div className="w-[240px]">
          <Label className="mb-1 block text-xs">Veículo</Label>
          <Select
            value={vehicleId ? String(vehicleId) : undefined}
            onValueChange={(v) => setVehicleId(Number(v))}
          >
            <SelectTrigger>
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
        </div>
      </div>

      {!vehicleId ? (
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Nenhum veículo encontrado</AlertTitle>
          <AlertDescription>
            Cadastre um veículo na tela <b>Meus Veículos</b> para usar a
            checklist.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Bloco de medição (hodômetro / planejamento / encerramento) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações da viagem</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <Label className="mb-1 block">Hodômetro inicial</Label>
                <Input
                  inputMode="numeric"
                  placeholder="Ex.: 32.500"
                  value={startOdo ?? ""}
                  onChange={(e) =>
                    updateVehicleState({
                      startOdo: e.target.value
                        ? Number(e.target.value.replace(/\D/g, ""))
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Quilometragem prevista</Label>
                <Input
                  inputMode="numeric"
                  placeholder="Ex.: 800"
                  value={plannedKm ?? ""}
                  onChange={(e) =>
                    updateVehicleState({
                      plannedKm: e.target.value
                        ? Number(e.target.value.replace(/\D/g, ""))
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Hodômetro final</Label>
                <Input
                  inputMode="numeric"
                  placeholder="Preencha ao final"
                  value={endOdo ?? ""}
                  onChange={(e) =>
                    updateVehicleState({
                      endOdo: e.target.value
                        ? Number(e.target.value.replace(/\D/g, ""))
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Litros gastos na viagem</Label>
                <Input
                  inputMode="numeric"
                  placeholder="Ex.: 52"
                  value={fuelLiters ?? ""}
                  onChange={(e) =>
                    updateVehicleState({
                      fuelLiters: e.target.value
                        ? Number(e.target.value.replace(/\D/g, ""))
                        : undefined,
                    })
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                <div>
                  <b>Distância prevista:</b>{" "}
                  {typeof plannedKm === "number" ? fmtKm(plannedKm) : "-"}
                </div>
                <div>
                  <b>Distância percorrida:</b>{" "}
                  {typeof tripKm === "number" ? fmtKm(tripKm) : "-"}
                </div>
                <div>
                  <b>Consumo da viagem:</b>{" "}
                  {typeof kmPerLiter === "number"
                    ? `${kmPerLiter.toFixed(2)} km/L`
                    : "-"}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    updateVehicleState({
                      startOdo: undefined,
                      plannedKm: undefined,
                      endOdo: undefined,
                      fuelLiters: undefined,
                    })
                  }
                >
                  Limpar medidas
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (
                      typeof startOdo === "number" &&
                      typeof plannedKm === "number"
                    ) {
                      updateVehicleState({ endOdo: startOdo + plannedKm });
                    }
                  }}
                >
                  Preencher fim pela previsão
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Checklist fixa */}
          <Card>
            <CardHeader>
              <CardTitle>Itens da checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PRESET_ITEMS.map((item) => {
                  const checked = vState?.checklist?.[item.id] ?? false;
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/40"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const nextChecklist = {
                            ...(vState?.checklist ?? {}),
                            [item.id]: Boolean(v),
                          };
                          updateVehicleState({ checklist: nextChecklist });
                        }}
                      />
                      <span className="pt-0.5 text-sm">{item.label}</span>
                    </label>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  <b>
                    {
                      Object.values(vState?.checklist ?? {}).filter(Boolean)
                        .length
                    }
                  </b>{" "}
                  de {PRESET_ITEMS.length} itens concluídos
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateVehicleState({
                        checklist: Object.fromEntries(
                          PRESET_ITEMS.map((i) => [i.id, false])
                        ),
                      })
                    }
                  >
                    Limpar checklist
                  </Button>
                  <Button
                    onClick={() =>
                      updateVehicleState({
                        checklist: Object.fromEntries(
                          PRESET_ITEMS.map((i) => [i.id, true])
                        ),
                      })
                    }
                  >
                    Marcar tudo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
