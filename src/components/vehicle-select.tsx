import { useQuery } from "@tanstack/react-query";
import { listVehicles } from "@/services/vehicle.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VehicleSelect({
  value,
  onChange,
  includeAll = false,
}: {
  value?: number | undefined;
  onChange: (id: number | undefined) => void;
  includeAll?: boolean;
}) {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: listVehicles,
  });

  return (
    <Select
      value={value ? String(value) : includeAll ? "all" : undefined}
      onValueChange={(v) => onChange(v === "all" ? undefined : Number(v))}
    >
      <SelectTrigger className="w-64">
        <SelectValue
          placeholder={
            isLoading
              ? "Carregando..."
              : includeAll
              ? "Todos os veículos"
              : "Selecione um veículo"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">Todos os veículos</SelectItem>}
        {vehicles?.map((v) => (
          <SelectItem key={v.id} value={String(v.id)}>
            {v.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
