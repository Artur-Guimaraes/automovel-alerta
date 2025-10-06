export const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n
  );

export const dmy = (epochSec: number) =>
  new Date(epochSec * 1000).toLocaleDateString("pt-BR");
