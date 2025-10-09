import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTheme } from "@/components/theme/theme-provider";
import { listVehicles } from "@/services/vehicle.service";
import {
  listMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  type Maintenance as Row,
} from "@/services/maintenance.service";
import { supabase } from "@/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// util
const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n
  );
const dmy = (epoch: number) =>
  new Date(epoch * 1000).toLocaleDateString("pt-BR");
const toNumberBR = (v: string) => Number((v || "").replace(",", "."));

export function Maintenance() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#d1d5db" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";
  const lineColor = isDarkMode ? "#60a5fa" : "#2563eb";
  const tooltipBg = isDarkMode ? "#1f2937" : "#ffffff";
  const tooltipText = isDarkMode ? "#f9fafb" : "#000000";

  // ===== veículos
  const { data: vehicles, isLoading: vehLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: listVehicles,
  });
  const [vehicleId, setVehicleId] = useState<number | undefined>(undefined);

  // autosseleciona 1º veículo
  useEffect(() => {
    if (!vehicleId && vehicles?.length) setVehicleId(vehicles[0].id);
  }, [vehicles, vehicleId]);

  // sessão para exibir “proprietário”
  const [me, setMe] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setMe(data.session?.user.id ?? null));
  }, []);

  const selectedVehicle = useMemo(
    () => vehicles?.find((v) => v.id === vehicleId),
    [vehicles, vehicleId]
  );

  // ===== listagem
  const {
    data: rows,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["maintenances", vehicleId],
    queryFn: () => listMaintenances(vehicleId as number),
    enabled: !!vehicleId,
  });

  // ===== form de criação
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [mileage, setMileage] = useState("");

  const createMut = useMutation({
    mutationFn: () =>
      createMaintenance({
        vehicleId: vehicleId as number,
        title: title.trim(),
        cost: toNumberBR(cost),
        date: date ?? new Date(),
        notes: notes.trim() || undefined,
        mileage: mileage ? toNumberBR(mileage) : undefined,
      }),
    onSuccess: () => {
      setTitle("");
      setCost("");
      setDate(new Date());
      setNotes("");
      setMileage("");
      refetch();
    },
  });

  // ===== editar/excluir (AlertDialog)
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [delRow, setDelRow] = useState<Row | null>(null);

  const updateMut = useMutation({
    mutationFn: (args: { id: number; patch: any }) =>
      updateMaintenance(args.id, args.patch),
    onSuccess: () => {
      setEditRow(null);
      refetch();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteMaintenance(id),
    onSuccess: () => {
      setDelRow(null);
      refetch();
    },
  });

  // gráfico: usa quilometragem das manutenções
  const mileageData = useMemo(() => {
    return (rows ?? [])
      .slice()
      .sort((a, b) => a.date - b.date)
      .filter((r) => (r.mileage ?? 0) > 0)
      .map((r) => ({
        date: format(new Date(r.date * 1000), "dd/MM"),
        mileage: r.mileage!,
      }));
  }, [rows]);

  if (vehLoading)
    return <div className="max-w-5xl mx-auto p-6">Carregando…</div>;
  if (!vehicles?.length)
    return (
      <div className="max-w-5xl mx-auto p-6">Cadastre um veículo primeiro.</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Histórico de Manutenções
      </h1>

      {/* linha com select + proprietário */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Select
          value={vehicleId ? String(vehicleId) : undefined}
          onValueChange={(v) => setVehicleId(Number(v))}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione um veículo" />
          </SelectTrigger>
          <SelectContent>
            {vehicles!.map((v) => (
              <SelectItem key={v.id} value={String(v.id)}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* (3) bullet com proprietário */}
        {selectedVehicle && (
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
            Proprietário:{" "}
            <b>
              {selectedVehicle.ownerId && me && selectedVehicle.ownerId === me
                ? "Você"
                : "Outro usuário"}
            </b>
          </span>
        )}
      </div>

      {vehicleId && (
        <>
          {/* Form de criação rápida */}
          <div className="grid md:grid-cols-4 gap-2">
            <Input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Custo"
              inputMode="decimal"
              step="any"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
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
            <Input
              placeholder="Quilometragem (km)"
              inputMode="numeric"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Observações (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            onClick={() => createMut.mutate()}
            disabled={!title.trim() || !toNumberBR(cost) || createMut.isPending}
          >
            {createMut.isPending ? "Salvando..." : "Adicionar"}
          </Button>

          {/* Lista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {isFetching && <p>Carregando…</p>}
            {(rows ?? []).map((m) => (
              <Card key={m.id} className="shadow-lg">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Editar"
                      onClick={() => setEditRow(m)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      title="Excluir"
                      onClick={() => setDelRow(m)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Data</span>
                    <b>{dmy(m.date)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo</span>
                    <b>{brl(m.cost)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Quilometragem</span>
                    <b>{(m.mileage ?? 0).toLocaleString("pt-BR")} km</b>
                  </div>
                  {m.notes ? <div className="pt-1">Obs.: {m.notes}</div> : null}
                </CardContent>
              </Card>
            ))}
            {!isFetching && !rows?.length && (
              <p className="col-span-full text-center text-muted-foreground">
                Nenhuma manutenção.
              </p>
            )}
          </div>

          {/* Gráfico */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">
              Evolução da Quilometragem
            </h2>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
              {mileageData.length > 1 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mileageData}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke={axisColor} />
                    <YAxis stroke={axisColor} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        color: tooltipText,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mileage"
                      stroke={lineColor}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center">
                  Dados insuficientes para exibir o gráfico.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal EDITAR */}
      <AlertDialog
        open={!!editRow}
        onOpenChange={(o) => !o && setEditRow(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar manutenção</AlertDialogTitle>
            <AlertDialogDescription>
              Altere os campos e salve.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {editRow && (
            <div className="space-y-2">
              <Input
                defaultValue={editRow.title}
                onChange={(e) => (editRow.title = e.target.value)}
              />
              <Input
                defaultValue={String(editRow.cost)}
                inputMode="decimal"
                step="any"
                onChange={(e) => (editRow.cost = toNumberBR(e.target.value))}
              />
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dmy(editRow.date)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(editRow.date * 1000)}
                      onSelect={(d) => {
                        if (d) editRow.date = Math.floor(d.getTime() / 1000);
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  placeholder="Quilometragem (km)"
                  defaultValue={String(editRow.mileage ?? "")}
                  inputMode="numeric"
                  onChange={(e) =>
                    (editRow.mileage = toNumberBR(e.target.value))
                  }
                />
              </div>
              <Textarea
                placeholder="Observações"
                defaultValue={editRow.notes ?? ""}
                onChange={(e) => (editRow.notes = e.target.value)}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!editRow) return;
                const patch: any = {
                  title: editRow.title,
                  cost: editRow.cost,
                  notes: editRow.notes ?? null,
                  mileage: editRow.mileage ?? 0,
                };
                // se o usuário trocou a data via calendário, já salvamos epoch direto
                if (typeof editRow.date === "number") patch.date = editRow.date;
                updateMut.mutate({ id: editRow.id, patch });
              }}
            >
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal EXCLUIR */}
      <AlertDialog open={!!delRow} onOpenChange={(o) => !o && setDelRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir manutenção?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => delRow && deleteMut.mutate(delRow.id)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
