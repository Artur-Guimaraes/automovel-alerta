import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VehicleSelect } from "@/components/vehicle-select";
import { listVehicles } from "@/services/vehicle.service";
import {
  listRefuelings,
  createRefueling,
  deleteRefueling,
  type Refueling,
  type FuelType,
} from "@/services/refueling.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { brl, dmy } from "@/lib/format";

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: "gasolina", label: "Gasolina Comum" },
  { value: "gasolina_aditivada", label: "Gasolina Aditivada" },
  { value: "etanol", label: "Etanol" },
  { value: "diesel", label: "Diesel S10" },
  { value: "gnv", label: "GNV" },
];

export default function RefuelingsPage() {
  // ===== veículos
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: listVehicles,
  });
  const [vehicleId, setVehicleId] = useState<number | undefined>(undefined);

  // auto-seleciona o 1º veículo quando carregar
  useEffect(() => {
    if (!vehicleId && vehicles?.length) {
      setVehicleId(vehicles[0].id);
    }
  }, [vehicles, vehicleId]);

  // ===== listagem conforme vehicleId
  const {
    data: rows,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["refuelings", vehicleId],
    queryFn: () => listRefuelings(vehicleId as number),
    enabled: !!vehicleId,
  });

  // ===== form
  const [liters, setLiters] = useState("");
  const [ppl, setPpl] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date()); // placeholder = hoje
  const [fuelType, setFuelType] = useState<FuelType>("gasolina");

  // total estimado
  const parsedLiters = Number((liters || "").replace(",", "."));
  const parsedPpl = Number((ppl || "").replace(",", "."));
  const estimated = isNaN(parsedLiters * parsedPpl)
    ? 0
    : parsedLiters * parsedPpl;

  const createMut = useMutation({
    mutationFn: () =>
      createRefueling({
        vehicleId: vehicleId as number,
        liters: parsedLiters,
        pricePerLiter: parsedPpl,
        date: date ?? new Date(),
        fuelType,
      }),
    onSuccess: () => {
      setLiters("");
      setPpl("");
      setDate(new Date());
      setFuelType("gasolina");
      refetch();
    },
  });

  // ===== exclusão com confirmação (AlertDialog)
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteRefueling(id),
    onSuccess: () => {
      setToDeleteId(null);
      refetch();
    },
  });

  // ===== estados vazios
  if (vehiclesLoading) {
    return <div className="max-w-4xl mx-auto p-6">Carregando…</div>;
  }
  if (!vehicles?.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        Cadastre um veículo primeiro em <b>Meus Veículos</b>.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Abastecimentos</h1>

      {/* Select de veículo (já entra com o primeiro selecionado) */}
      <VehicleSelect value={vehicleId} onChange={setVehicleId} />

      {vehicleId && (
        <>
          {/* Form (4 colunas: litros, preço, data, combustível) */}
          <div className="grid md:grid-cols-4 gap-2">
            <Input
              placeholder="Litros"
              inputMode="decimal"
              step="any"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
            />

            <Input
              placeholder="Preço/Litro"
              inputMode="decimal"
              step="any"
              value={ppl}
              onChange={(e) => setPpl(e.target.value)}
            />

            {/* Datepicker shadcn: mostra HOJE por padrão; ao abrir, zera pra escolher */}
            <Popover onOpenChange={(open) => open && setDate(undefined)}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? format(date, "dd/MM/yyyy", { locale: ptBR })
                    : format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => setDate(d || new Date())}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            {/* Tipo de combustível */}
            <Select
              value={fuelType}
              onValueChange={(v) => setFuelType(v as FuelType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Combustível" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* total estimado */}
          <div className="text-sm text-muted-foreground">
            Total estimado: <b>{brl(estimated || 0)}</b>
          </div>

          <Button
            onClick={() => createMut.mutate()}
            disabled={!parsedLiters || !parsedPpl || createMut.isPending}
          >
            {createMut.isPending ? "Salvando..." : "Adicionar"}
          </Button>

          {/* Lista */}
          <div className="grid gap-3 mt-4">
            {isFetching && <p>Carregando…</p>}
            {rows?.map((r: Refueling) => (
              <Card key={r.id} className="border border-border/70">
                {/* Cabeçalho mais alinhado (2): data à esquerda, total + lixeira à direita */}
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{dmy(r.date)}</CardTitle>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                      {fuelTypes.find((f) => f.value === r.fuelType)?.label ??
                        r.fuelType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setToDeleteId(r.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground">
                  {/* segunda linha, conta formatada e alinhada */}
                  <div className="flex justify-between">
                    <span>
                      {r.liters} L × {brl(r.pricePerLiter)}
                    </span>
                    <b>{brl(r.total)}</b>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!rows?.length && !isFetching && <p>Nenhum abastecimento.</p>}
          </div>
        </>
      )}

      {/* (3) Confirmação de exclusão */}
      <AlertDialog
        open={toDeleteId !== null}
        onOpenChange={(o) => !o && setToDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir abastecimento?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita. O registro será removido
              definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDeleteId && deleteMut.mutate(toDeleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
