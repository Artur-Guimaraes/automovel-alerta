"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { ptBR } from "date-fns/locale";
import {
  format,
  addDays,
  differenceInCalendarDays,
  isWithinInterval,
} from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { Calendar as CalendarIcon, UploadCloud } from "lucide-react";

/* ================= Helpers de máscara ================= */

const fBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pBRL = (s: string) => {
  const only = s.replace(/[^\d]/g, "");
  const asNumber = Number(only) / 100;
  return isNaN(asNumber) ? 0 : asNumber;
};

const maskBRL = (v: string) => fBRL(pBRL(v));

const maskKM = (v: string) => {
  const only = v.replace(/[^\d]/g, "");
  const n = Number(only || "0");
  return `${n.toLocaleString("pt-BR")} km`;
};

/* ================= Tipos/constantes ================= */

type Gravity = "leve" | "media" | "grave" | "gravissima";

const GRAVITY_POINTS: Record<Gravity, number> = {
  leve: 3,
  media: 4,
  grave: 5,
  gravissima: 7,
};

const gravityColor: Record<Gravity, string> = {
  leve: "bg-emerald-600 text-white",
  media: "bg-yellow-500 text-black",
  grave: "bg-orange-600 text-white",
  gravissima: "bg-red-600 text-white",
};

type Fine = {
  id: string;
  local: string;
  data: string; // ISO date (yyyy-MM-dd)
  hora?: string; // HH:mm
  placa?: string;
  codigo?: string;
  gravidade: Gravity;
  valor: number; // R$
  pontos: number; // fixo a partir da gravidade
  descricao?: string;
  prazo: string; // ISO date
  hodometro?: number | null;
  pdfName?: string;
  pdfDataUrl?: string;
};

const schema = z.object({
  local: z.string().min(2),
  data: z.date(),
  hora: z.string().optional(),
  placa: z.string().optional(),
  codigo: z.string().optional(),
  gravidade: z.custom<Gravity>(),
  valorMask: z
    .string()
    .min(1)
    .transform((s) => ({ mask: s, value: pBRL(s) })),
  descricao: z.string().optional(),
  prazo: z.date(),
  hodometroMask: z
    .string()
    .optional()
    .transform((s) => (s ? Number(s.replace(/[^\d]/g, "")) : undefined)),
});

/* ================= Página ================= */

export default function Fines() {
  // storage local
  const [fines, setFines] = useState<Fine[]>(() => {
    try {
      const raw = localStorage.getItem("fines@autos");
      return raw ? (JSON.parse(raw) as Fine[]) : [];
    } catch {
      return [];
    }
  });

  // form
  const pdfRef = useRef<HTMLInputElement | null>(null);
  const [pdfName, setPdfName] = useState<string | undefined>();
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>();

  const [form, setForm] = useState({
    local: "",
    data: new Date(),
    hora: "",
    placa: "",
    codigo: "",
    gravidade: "media" as Gravity,
    valorMask: "",
    descricao: "",
    prazo: addDays(new Date(), 15),
    hodometroMask: "",
  });

  // persiste
  useEffect(() => {
    localStorage.setItem("fines@autos", JSON.stringify(fines));
  }, [fines]);

  // pontos dos últimos 12 meses
  const totalPoints12m = useMemo(() => {
    const now = new Date();
    const start = addDays(now, -365);
    return fines
      .filter((f) => isWithinInterval(new Date(f.data), { start, end: now }))
      .reduce((acc, f) => acc + (f.pontos || 0), 0);
  }, [fines]);

  // lembrete de vencimento próximo (3 dias) — apenas visual na tela
  const dueSoonList = useMemo(() => {
    const now = new Date();
    const end = addDays(now, 3);
    return fines.filter((f) =>
      isWithinInterval(new Date(f.prazo), { start: now, end })
    );
  }, [fines]);

  function onPdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setPdfName(undefined);
      setPdfDataUrl(undefined);
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Por favor, selecione um arquivo PDF.");
      if (pdfRef.current) pdfRef.current.value = "";
      setPdfName(undefined);
      setPdfDataUrl(undefined);
      return;
    }

    setPdfName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPdfDataUrl(result); // data:application/pdf;base64,...
      }
    };
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm({
      local: "",
      data: new Date(),
      hora: "",
      placa: "",
      codigo: "",
      gravidade: "media",
      valorMask: "",
      descricao: "",
      prazo: addDays(new Date(), 15),
      hodometroMask: "",
    });
    setPdfName(undefined);
    setPdfDataUrl(undefined);
    if (pdfRef.current) pdfRef.current.value = "";
  }

  function addFine(e: React.FormEvent) {
    e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      alert("Verifique os campos obrigatórios.");
      return;
    }

    const pontos = GRAVITY_POINTS[form.gravidade];

    const f: Fine = {
      id: crypto.randomUUID(),
      local: parsed.data.local,
      data: toISODate(parsed.data.data),
      hora: parsed.data.hora,
      placa: parsed.data.placa,
      codigo: parsed.data.codigo,
      gravidade: form.gravidade,
      valor: parsed.data.valorMask.value,
      pontos,
      descricao: parsed.data.descricao,
      prazo: toISODate(parsed.data.prazo),
      hodometro: parsed.data.hodometroMask ?? null,
      pdfName,
      pdfDataUrl,
    };

    setFines((old) => [f, ...old]);
    resetForm();
  }

  function openPdf(dataUrl?: string) {
    if (!dataUrl) return;

    const win = window.open(dataUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      alert(
        "O navegador bloqueou a abertura do PDF. Permita pop-ups para visualizar o arquivo."
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Multas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Pontuação acumulada nos últimos 12 meses:{" "}
        <span className="font-semibold">
          {totalPoints12m} ponto{totalPoints12m === 1 ? "" : "s"}
        </span>
      </p>

      {dueSoonList.length > 0 && (
        <Alert className="mb-6">
          <CalendarIcon className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Você tem {dueSoonList.length} multa
            {dueSoonList.length === 1 ? "" : "s"} com vencimento nos próximos 3
            dias.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulário */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registrar nova multa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addFine} className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <Label>Local da multa</Label>
              <Input
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
                placeholder="Ex.: Av. Brasil, 1000"
              />
            </div>

            {/* Datepicker (Data) */}
            <div className="col-span-6 md:col-span-3">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {format(form.data, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.data}
                    onSelect={(d) => d && setForm({ ...form, data: d })}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Hora</Label>
              <Input
                type="time"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
              />
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Placa (opcional)</Label>
              <Input
                value={form.placa}
                onChange={(e) =>
                  setForm({ ...form, placa: e.target.value.toUpperCase() })
                }
                placeholder="ABC1D23"
              />
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Cód. Infração (opcional)</Label>
              <Input
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                placeholder="Ex.: 746-90"
              />
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Gravidade</Label>
              <Select
                value={form.gravidade}
                onValueChange={(v) =>
                  setForm({ ...form, gravidade: v as Gravity })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leve">
                    <span className="text-emerald-600">Leve (3 pts)</span>
                  </SelectItem>
                  <SelectItem value="media">
                    <span className="text-yellow-500">Média (4 pts)</span>
                  </SelectItem>
                  <SelectItem value="grave">
                    <span className="text-orange-600">Grave (5 pts)</span>
                  </SelectItem>
                  <SelectItem value="gravissima">
                    <span className="text-red-600">Gravíssima (7 pts)</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Pontos</Label>
              <Input value={`${GRAVITY_POINTS[form.gravidade]}`} disabled />
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Valor</Label>
              <Input
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={form.valorMask}
                onChange={(e) =>
                  setForm({ ...form, valorMask: maskBRL(e.target.value) })
                }
              />
            </div>

            <div className="col-span-6 md:col-span-3">
              <Label>Hodômetro (opcional)</Label>
              <Input
                inputMode="numeric"
                value={form.hodometroMask}
                onChange={(e) =>
                  setForm({ ...form, hodometroMask: maskKM(e.target.value) })
                }
                placeholder="0 km"
              />
            </div>

            <div className="col-span-12">
              <Label>Descrição (opcional)</Label>
              <Textarea
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                placeholder="Observações, contexto, etc."
              />
            </div>

            {/* Datepicker (Prazo) */}
            <div className="col-span-12 md:col-span-6">
              <Label>Prazo p/ pagar/defesa</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {format(form.prazo, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.prazo}
                    onSelect={(d) => d && setForm({ ...form, prazo: d })}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-12 md:col-span-6">
              <Label>PDF da multa (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={pdfRef}
                  type="file"
                  accept="application/pdf"
                  onChange={onPdfChange}
                />
                {pdfName ? (
                  <Badge variant="secondary" className="truncate max-w-[200px]">
                    {pdfName}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <UploadCloud className="h-3.5 w-3.5" /> PDF
                  </Badge>
                )}
                {pdfDataUrl && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openPdf(pdfDataUrl)}
                  >
                    Ver PDF
                  </Button>
                )}
              </div>
              {pdfDataUrl && (
                <div className="mt-2 text-xs text-muted-foreground">
                  * O PDF é armazenado apenas neste navegador (localmente) e não
                  é enviado para nenhum servidor.
                </div>
              )}
            </div>

            <div className="col-span-12 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Limpar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Multas registradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fines.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma multa cadastrada.</p>
          ) : (
            fines.map((f) => (
              <div
                key={f.id}
                className="rounded-xl border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={gravityColor[f.gravidade]}>
                      {labelGravity(f.gravidade)}
                    </Badge>
                    <span className="font-medium">{f.local}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(f.data), "dd/MM/yyyy", { locale: ptBR })}{" "}
                    {f.hora ? `às ${f.hora}` : ""} · {f.placa || "sem placa"} ·{" "}
                    {f.codigo || "sem código"} · {f.pontos} pts
                  </div>
                  {f.descricao && <div className="text-sm">{f.descricao}</div>}
                  {typeof f.hodometro === "number" && (
                    <div className="text-sm text-muted-foreground">
                      Hodômetro: {f.hodometro.toLocaleString("pt-BR")} km
                    </div>
                  )}
                  <div className="text-sm">
                    Valor: <span className="font-medium">{fBRL(f.valor)}</span>{" "}
                    · Prazo:{" "}
                    <span className="font-medium">
                      {format(new Date(f.prazo), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </span>{" "}
                    ({daysLeft(new Date(f.prazo))})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {f.pdfDataUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openPdf(f.pdfDataUrl)}
                    >
                      Ver PDF
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setFines((old) => old.filter((x) => x.id !== f.id))
                    }
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= Utils locais ================= */

function toISODate(d: Date) {
  // zera hora para manter só a data
  const nd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return nd.toISOString().slice(0, 10);
}

function labelGravity(g: Gravity) {
  switch (g) {
    case "leve":
      return "Leve";
    case "media":
      return "Média";
    case "grave":
      return "Grave";
    case "gravissima":
      return "Gravíssima";
  }
}

function daysLeft(due: Date) {
  const diff = differenceInCalendarDays(due, new Date());
  if (diff < 0) return "vencida";
  if (diff === 0) return "vence hoje";
  if (diff === 1) return "vence amanhã";
  return `vence em ${diff} dias`;
}
