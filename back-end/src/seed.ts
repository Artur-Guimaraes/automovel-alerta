import "dotenv/config";
import { db } from "./db";
import * as schema from "./schema";
import { and, eq } from "drizzle-orm";

// util
const toEpoch = (y: number, m: number, d: number) =>
  Math.floor(new Date(y, m - 1, d).getTime() / 1000);
const rnd = (min: number, max: number) =>
  +(min + Math.random() * (max - min)).toFixed(2);
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

async function seedForUser(ownerId: string) {
  console.log(`\nSeeding para user: ${ownerId}`);

  // opcional: reset dos dados do usuário antes de inserir
  if (process.env.SEED_RESET === "true") {
    await db
      .delete(schema.refuelings)
      .where(eq(schema.refuelings.ownerId, ownerId));
    await db
      .delete(schema.maintenances)
      .where(eq(schema.maintenances.ownerId, ownerId));
    await db
      .delete(schema.expenses)
      .where(eq(schema.expenses.ownerId, ownerId));
    await db
      .delete(schema.vehicles)
      .where(eq(schema.vehicles.ownerId, ownerId));
  }

  // 2 veículos
  const vehicles = await db
    .insert(schema.vehicles)
    .values([
      {
        ownerId,
        name: "Carro da Cidade",
        model: "208",
        plate: "ABC1D23",
        mileage: 42000,
      },
      {
        ownerId,
        name: "SUV da Família",
        model: "Duster",
        plate: "DEF4G56",
        mileage: 68000,
      },
    ])
    .returning();

  const fuelTypes = [
    "gasolina",
    "gasolina_aditivada",
    "etanol",
    "diesel",
    "gnv",
  ] as const;

  // Abastecimentos: 8 meses pra cada veículo
  for (const v of vehicles) {
    let baseKm = v.mileage ?? 20000;
    for (let i = 0; i < 8; i++) {
      const day = 28 - i; // só pra variar
      const y = 2025 - (i > 5 ? 1 : 0);
      const m = (10 - i + 12) % 12 || 12;
      const liters = rnd(25, 50);
      const price = rnd(5.0, 6.5);
      const total = +(liters * price).toFixed(2);

      await db.insert(schema.refuelings).values({
        ownerId,
        vehicleId: v.id!,
        liters,
        pricePerLiter: price,
        total,
        fuelType: pick([...fuelTypes]),
        date: toEpoch(y, m, day),
      });

      baseKm += Math.round(liters * 10); // km aproximado por tanque
    }
  }

  // Manutenções (com km) e Expenses
  for (const v of vehicles) {
    await db.insert(schema.maintenances).values([
      {
        ownerId,
        vehicleId: v.id!,
        title: "Troca de óleo",
        cost: 220,
        date: toEpoch(2025, 3, 12),
        notes: "5W30 sintético",
        mileage: (v.mileage ?? 20000) + 1000,
      },
      {
        ownerId,
        vehicleId: v.id!,
        title: "Alinhamento",
        cost: 140,
        date: toEpoch(2025, 6, 2),
        notes: "Dianteiro e traseiro",
        mileage: (v.mileage ?? 20000) + 3500,
      },
      {
        ownerId,
        vehicleId: v.id!,
        title: "Filtros",
        cost: 180,
        date: toEpoch(2025, 8, 21),
        notes: "Ar/combustível/cabine",
        mileage: (v.mileage ?? 20000) + 6000,
      },
    ]);

    await db.insert(schema.expenses).values([
      {
        ownerId,
        vehicleId: v.id!,
        title: "IPVA",
        cost: 950,
        date: toEpoch(2025, 1, 20),
        isRecurringMonthly: false,
      },
      {
        ownerId,
        vehicleId: v.id!,
        title: "Seguro",
        cost: 1800,
        date: toEpoch(2025, 1, 5),
        isRecurringMonthly: false,
      },
      {
        ownerId,
        vehicleId: v.id!,
        title: "Estacionamento",
        cost: 20,
        date: toEpoch(2025, 9, 4),
        isRecurringMonthly: true,
      },
    ]);
  }

  console.log(`✅ Seed OK para ${ownerId}`);
}

(async () => {
  const users = [process.env.SEED_USER_ID_1, process.env.SEED_USER_ID_2].filter(
    Boolean
  ) as string[];
  if (users.length === 0) {
    console.log(
      "Defina no .env do back: SEED_USER_ID_1 (e opcionalmente SEED_USER_ID_2)."
    );
    console.log(
      "Dica: no console do front: copy((await supabase.auth.getSession()).data.session.user.id)"
    );
    process.exit(1);
  }

  for (const u of users) {
    await seedForUser(u);
  }
  console.log("\n🎉 Seed finalizado.");
  process.exit(0);
})();
