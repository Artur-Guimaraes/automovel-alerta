-- Super seed gerado automaticamente
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  name TEXT NOT NULL,
  model TEXT,
  plate TEXT,
  mileage INTEGER DEFAULT 0
);


CREATE TABLE IF NOT EXISTS refuelings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  vehicleId INTEGER NOT NULL,
  liters REAL NOT NULL,
  pricePerLiter REAL NOT NULL,
  total REAL NOT NULL,
  date INTEGER NOT NULL,
  fuelType TEXT,
  mileage INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS maintenances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  vehicleId INTEGER NOT NULL,
  title TEXT NOT NULL,
  cost REAL NOT NULL,
  date INTEGER NOT NULL,
  notes TEXT,
  mileage INTEGER DEFAULT 0
);


CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  vehicleId INTEGER NOT NULL,
  title TEXT NOT NULL,
  cost REAL NOT NULL,
  date INTEGER NOT NULL,
  isRecurringMonthly INTEGER DEFAULT 0
);


CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  vehicleId INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  value REAL,
  startDate INTEGER,
  dueDate INTEGER NOT NULL,
  isPaid INTEGER DEFAULT 0,
  notes TEXT,
  pdfPath TEXT,
  pdfOriginalName TEXT,
  pdfMime TEXT
);


CREATE TABLE IF NOT EXISTS fines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  vehicleId INTEGER NOT NULL,
  location TEXT,
  severity TEXT,
  value REAL NOT NULL,
  date INTEGER NOT NULL,
  dueDate INTEGER NOT NULL,
  points INTEGER NOT NULL,
  notes TEXT,
  pdfPath TEXT
);


CREATE TABLE IF NOT EXISTS trip_checklists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId TEXT NOT NULL,
  vehicleId INTEGER NOT NULL,
  startOdo INTEGER NOT NULL,
  plannedKm INTEGER NOT NULL,
  endOdo INTEGER,
  fuelSpentL REAL,
  notes TEXT,
  createdAt INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS trip_checklist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checklistId INTEGER NOT NULL,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 0
);

INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Civic', 'Honda Civic EXL 2.0', 'ABC1D23', 78500);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Onix', 'Chevrolet Onix 1.0 Turbo', 'XYZ2E45', 41200);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'HB20', 'Hyundai HB20 1.6', 'JKL3F67', 53600);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Compass', 'Jeep Compass 2.0 Diesel', 'MNO4G89', 27800);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Argo', 'Fiat Argo 1.3', 'PQR5H01', 62300);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Corolla', 'Toyota Corolla 2.0', 'STU6J23', 90500);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Gol', 'VW Gol 1.6', 'VWX7K45', 120500);
INSERT INTO vehicles (ownerId, name, model, plate, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 'Sandero', 'Renault Sandero 1.6', 'YZA8L67', 70200);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 28.57, 4.89, 139.71, 1718043619, 'ETANOL', 60555);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Filtro de ar', 997.6, 1718043619, 'Serviço realizado em Rio de Janeiro/RJ', 60555);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 28.14, 6.21, 174.75, 1718734819, 'GASOLINA', 61028);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 40.62, 6.57, 266.87, 1719598819, 'GASOLINA', 61737);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Estacionamento', 47.43, 1719598819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 33.3, 6.73, 224.11, 1720290019, 'GASOLINA_ADITIVADA', 62081);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 54.06, 5.66, 305.98, 1721586019, 'DIESEL', 62458);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 44.66, 6.39, 285.38, 1722968419, 'GASOLINA', 62904);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 33.3, 6.77, 225.44, 1724696419, 'DIESEL', 63257);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 44.56, 6.3, 280.73, 1726165219, 'GASOLINA', 63780);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Lava-jato', 36.93, 1726165219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 43.96, 5.61, 246.62, 1727634019, 'GASOLINA', 64254);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Estacionamento', 54.13, 1727634019, 1);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Alinhamento e balanceamento', 1483.31, 1727634019, 'Serviço realizado em Duque de Caxias/RJ', 64254);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 25.0, 3.77, 94.25, 1729102819, 'ETANOL', 64973);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Filtro de ar', 950.75, 1729102819, 'Serviço realizado em Niterói/RJ', 64973);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 37.27, 6.75, 251.57, 1729880419, 'GASOLINA', 65744);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Pedágio', 97.13, 1729880419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 40.86, 6.56, 268.04, 1731003619, 'DIESEL', 66384);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 43.86, 6.58, 288.6, 1732472419, 'GASOLINA_ADITIVADA', 66751);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 53.38, 6.95, 370.99, 1733682019, 'GASOLINA_ADITIVADA', 67004);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 49.46, 3.55, 175.58, 1735410019, 'ETANOL', 67559);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 37.1, 6.87, 254.88, 1736792419, 'GASOLINA', 68140);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 28.43, 5.35, 152.1, 1737656419, 'GASOLINA', 68449);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 53.14, 3.81, 202.46, 1738434019, 'ETANOL', 69185);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 44.95, 7.49, 336.68, 1739730019, 'DIESEL', 69640);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Troca de óleo', 635.64, 1739730019, 'Serviço realizado em Rio de Janeiro/RJ', 69640);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 40.59, 4.55, 184.68, 1740766819, 'ETANOL', 69911);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Lava-jato', 79.42, 1740766819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 22.48, 3.84, 86.32, 1742494819, 'ETANOL', 70499);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 48.26, 3.42, 165.05, 1743358819, 'ETANOL', 71233);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 43.57, 5.31, 231.36, 1744568419, 'GASOLINA', 71538);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 26.66, 5.78, 154.09, 1745432419, 'DIESEL', 71984);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Estacionamento', 37.48, 1745432419, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 21.77, 6.94, 151.08, 1747074019, 'GASOLINA', 72334);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 36.85, 7.3, 269.0, 1748197219, 'DIESEL', 73081);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Pedágio', 118.38, 1748197219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 44.38, 5.81, 257.85, 1749147619, 'DIESEL', 73764);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 22.0, 6.51, 143.22, 1750702819, 'DIESEL', 74335);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 22.4, 6.42, 143.81, 1752430819, 'GASOLINA', 74775);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Pedágio', 113.58, 1752430819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 34.67, 6.88, 238.53, 1753813219, 'GASOLINA_ADITIVADA', 75108);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Lava-jato', 44.56, 1753813219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 36.0, 5.22, 187.92, 1755282019, 'GASOLINA', 75665);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Troca de óleo', 1238.28, 1755282019, 'Serviço realizado em Petrópolis/RJ', 75665);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 52.66, 6.78, 357.03, 1756232419, 'GASOLINA', 76050);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 20.27, 6.88, 139.46, 1757614819, 'GASOLINA_ADITIVADA', 76841);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Pedágio', 39.09, 1757614819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 41.17, 5.57, 229.32, 1758565219, 'GASOLINA_ADITIVADA', 77379);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 23.23, 7.16, 166.33, 1759515619, 'DIESEL', 77681);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Estacionamento', 94.82, 1759515619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 39.31, 6.62, 260.23, 1760293219, 'DIESEL', 78383);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Lava-jato', 109.43, 1760293219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 35.04, 5.75, 201.48, 1761675619, 'GASOLINA', 78784);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'Pastilhas de freio', 556.96, 1761675619, 'Serviço realizado em Niterói/RJ', 78784);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 32.38, 7.45, 241.23, 1763144419, 'DIESEL', 79139);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'ipva', 'IPVA 2024', 3435.76, 1704067200, 1712707200, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'licenciamento', 'Licenciamento 2024', 135.41, 1704067200, 1727308800, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'seguro', 'Seguro 2024/2025', 2338.08, 1719792000, 1751328000, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'ipva', 'IPVA 2025', 2912.44, 1735689600, 1744675200, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'licenciamento', 'Licenciamento 2025', 260.45, 1735689600, 1757808000, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 'seguro', 'Seguro 2025/2026', 2544.5, 1766707200, 1798243200, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 74867, 371, NULL, NULL, 'Viagem planejada', 1748629219);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 76178, 1113, NULL, NULL, 'Viagem planejada', 1763317219);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 1, 75136, 1092, NULL, NULL, 'Viagem planejada', 1759688419);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 27.8, 4.12, 114.54, 1719166819, 'ETANOL', 28683);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pastilhas de freio', 1454.28, 1719166819, 'Serviço realizado em Duque de Caxias/RJ', 28683);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 31.59, 5.41, 170.9, 1720635619, 'GASOLINA', 29482);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 40.88, 6.51, 266.13, 1721240419, 'GASOLINA_ADITIVADA', 29843);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 28.92, 5.5, 159.06, 1722363619, 'DIESEL', 30287);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 22.45, 6.32, 141.88, 1723400419, 'GASOLINA_ADITIVADA', 30978);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 43.34, 5.92, 256.57, 1724696419, 'GASOLINA_ADITIVADA', 31544);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 43.71, 4.62, 201.94, 1726165219, 'ETANOL', 32182);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pastilhas de freio', 716.78, 1726165219, 'Serviço realizado em Duque de Caxias/RJ', 32182);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 36.27, 6.85, 248.45, 1727806819, 'DIESEL', 32761);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Bateria', 296.37, 1727806819, 'Serviço realizado em Petrópolis/RJ', 32761);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 23.27, 4.75, 110.53, 1729275619, 'ETANOL', 33354);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pedágio', 26.21, 1729275619, 0);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Rio de Janeiro/RJ', 'gravissima', 615.7, 1729275619, 1731867619, 7, 'Radar 69 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 45.14, 6.49, 292.96, 1730744419, 'DIESEL', 33803);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Lava-jato', 85.64, 1730744419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 27.66, 5.6, 154.9, 1732386019, 'DIESEL', 34488);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pedágio', 60.21, 1732386019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 41.44, 7.16, 296.71, 1734027619, 'DIESEL', 35191);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 46.31, 6.58, 304.72, 1735237219, 'GASOLINA_ADITIVADA', 35706);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 44.97, 3.82, 171.79, 1736446819, 'ETANOL', 36035);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 33.41, 4.82, 161.04, 1737224419, 'ETANOL', 36521);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Estacionamento', 46.4, 1737224419, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 33.63, 6.74, 226.67, 1738088419, 'GASOLINA', 37201);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 46.37, 6.58, 305.11, 1739125219, 'DIESEL', 37756);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 29.55, 5.56, 164.3, 1740334819, 'DIESEL', 38230);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 49.42, 5.46, 269.83, 1741890019, 'ETANOL', 38649);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Troca de óleo', 1456.92, 1741890019, 'Serviço realizado em Niterói/RJ', 38649);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 26.36, 5.88, 155.0, 1743618019, 'GASOLINA_ADITIVADA', 39371);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Estacionamento', 47.13, 1743618019, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 28.83, 6.05, 174.42, 1745259619, 'GASOLINA', 40052);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Rio de Janeiro/RJ', 'grave', 282.83, 1745259619, 1747851619, 5, 'Radar 42 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 49.37, 3.75, 185.14, 1746123619, 'ETANOL', 40506);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pneus', 1574.89, 1746123619, 'Serviço realizado em Nova Iguaçu/RJ', 40506);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 47.22, 5.42, 255.93, 1746901219, 'ETANOL', 40873);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pedágio', 112.18, 1746901219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 22.66, 3.43, 77.72, 1748024419, 'ETANOL', 41326);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 32.15, 6.82, 219.26, 1749666019, 'DIESEL', 41618);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Lava-jato', 47.54, 1749666019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 53.63, 6.91, 370.58, 1750357219, 'DIESEL', 42311);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 36.27, 5.78, 209.64, 1751739619, 'GASOLINA_ADITIVADA', 43056);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pedágio', 40.68, 1751739619, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 31.77, 7.2, 228.74, 1753122019, 'DIESEL', 43694);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pedágio', 49.03, 1753122019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 39.45, 3.4, 134.13, 1754504419, 'ETANOL', 44226);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Bateria', 1110.27, 1754504419, 'Serviço realizado em Duque de Caxias/RJ', 44226);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 23.26, 4.13, 96.06, 1755714019, 'ETANOL', 44493);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Lava-jato', 73.97, 1755714019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 32.31, 6.04, 195.15, 1756837219, 'DIESEL', 45081);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 46.0, 3.64, 167.44, 1757874019, 'ETANOL', 45453);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 30.37, 5.52, 167.64, 1758565219, 'GASOLINA_ADITIVADA', 45901);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Lava-jato', 23.92, 1758565219, 0);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Niterói/RJ', 'leve', 565.89, 1758565219, 1761157219, 3, 'Radar 80 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 40.09, 6.46, 258.98, 1759256419, 'DIESEL', 46163);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 23.99, 5.92, 142.02, 1760984419, 'GASOLINA', 46902);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Lava-jato', 85.51, 1760984419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 24.15, 6.71, 162.05, 1761675619, 'DIESEL', 47406);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 30.41, 6.11, 185.81, 1762885219, 'DIESEL', 48109);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Alinhamento e balanceamento', 1421.07, 1762885219, 'Serviço realizado em Nova Iguaçu/RJ', 48109);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 28.4, 5.48, 155.63, 1764094819, 'GASOLINA', 48519);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 30.08, 6.47, 194.62, 1764094819, 'GASOLINA_ADITIVADA', 49006);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 34.88, 4.69, 163.59, 1763662819, 'ETANOL', 49458);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 40.83, 5.99, 244.57, 1764008419, 'GASOLINA_ADITIVADA', 50022);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 35.32, 6.8, 240.18, 1763749219, 'GASOLINA', 50777);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 54.99, 6.24, 343.14, 1764008419, 'GASOLINA_ADITIVADA', 51048);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 42.22, 7.44, 314.12, 1764008419, 'DIESEL', 51744);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 31.54, 6.08, 191.76, 1764094819, 'DIESEL', 52158);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 28.83, 6.95, 200.37, 1764094819, 'GASOLINA', 52730);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 34.46, 4.39, 151.28, 1763749219, 'ETANOL', 53453);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 29.35, 5.33, 156.44, 1764094819, 'ETANOL', 53911);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 44.84, 6.19, 277.56, 1763662819, 'GASOLINA_ADITIVADA', 54406);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pneus', 2089.89, 1763662819, 'Serviço realizado em Niterói/RJ', 54406);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 37.81, 5.95, 224.97, 1763662819, 'GASOLINA_ADITIVADA', 54954);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 26.67, 5.19, 138.42, 1764008419, 'ETANOL', 55596);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 48.72, 6.51, 317.17, 1763749219, 'GASOLINA_ADITIVADA', 56119);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 38.85, 5.8, 225.33, 1764008419, 'GASOLINA_ADITIVADA', 56826);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 40.01, 5.17, 206.85, 1764008419, 'ETANOL', 57320);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 54.59, 4.34, 236.92, 1763835619, 'ETANOL', 57965);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Lava-jato', 116.19, 1763835619, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pneus', 327.4, 1763835619, 'Serviço realizado em Duque de Caxias/RJ', 57965);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 34.35, 3.37, 115.76, 1763662819, 'ETANOL', 58362);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 49.83, 7.41, 369.24, 1764094819, 'DIESEL', 58948);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 41.61, 4.65, 193.49, 1763749219, 'ETANOL', 59234);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 35.53, 6.83, 242.67, 1764094819, 'GASOLINA_ADITIVADA', 59586);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Pedágio', 42.27, 1764094819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 39.81, 3.59, 142.92, 1763749219, 'ETANOL', 60257);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'Estacionamento', 78.17, 1763749219, 1);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'ipva', 'IPVA 2024', 2045.1, 1704067200, 1712880000, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'licenciamento', 'Licenciamento 2024', 191.91, 1704067200, 1725840000, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'seguro', 'Seguro 2024/2025', 4496.73, 1730419200, 1761955200, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'ipva', 'IPVA 2025', 3233.27, 1735689600, 1745020800, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'licenciamento', 'Licenciamento 2025', 209.32, 1735689600, 1758499200, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 'seguro', 'Seguro 2025/2026', 4635.71, 1739577600, 1771113600, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 38652, 1018, NULL, NULL, 'Viagem planejada', 1750011619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 39069, 768, NULL, NULL, 'Viagem planejada', 1754072419);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 39827, 1139, NULL, NULL, 'Viagem planejada', 1755627619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 2, 37760, 931, NULL, NULL, 'Viagem planejada', 1758910819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 20.77, 6.05, 125.66, 1718994019, 'DIESEL', 36735);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Filtro de ar', 1669.96, 1718994019, 'Serviço realizado em Nova Iguaçu/RJ', 36735);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 41.25, 5.59, 230.59, 1720635619, 'GASOLINA_ADITIVADA', 37220);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Estacionamento', 84.55, 1720635619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 51.62, 5.76, 297.33, 1722104419, 'GASOLINA', 37569);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 31.44, 5.85, 183.92, 1722795619, 'DIESEL', 38121);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Lava-jato', 106.41, 1722795619, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 28.99, 7.43, 215.4, 1724523619, 'DIESEL', 38539);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 24.93, 5.18, 129.14, 1725733219, 'ETANOL', 38866);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 20.49, 6.02, 123.35, 1726424419, 'GASOLINA', 39520);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 23.79, 4.28, 101.82, 1728152419, 'ETANOL', 40150);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 42.67, 7.32, 312.34, 1729534819, 'DIESEL', 40626);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 30.65, 5.73, 175.62, 1730139619, 'DIESEL', 40914);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Lava-jato', 24.92, 1730139619, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Filtro de ar', 1663.92, 1730139619, 'Serviço realizado em Niterói/RJ', 40914);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 49.18, 7.38, 362.95, 1731262819, 'DIESEL', 41265);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 53.27, 5.38, 286.59, 1732472419, 'GASOLINA_ADITIVADA', 41970);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 29.66, 6.91, 204.95, 1733077219, 'GASOLINA', 42627);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 21.77, 5.64, 122.78, 1734546019, 'GASOLINA_ADITIVADA', 42898);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Lava-jato', 32.57, 1734546019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 48.46, 3.96, 191.9, 1735928419, 'ETANOL', 43369);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Lava-jato', 10.31, 1735928419, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Alinhamento e balanceamento', 1243.65, 1735928419, 'Serviço realizado em Niterói/RJ', 43369);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 24.61, 6.62, 162.92, 1736619619, 'GASOLINA_ADITIVADA', 43645);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Estacionamento', 11.74, 1736619619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 38.41, 6.06, 232.76, 1738174819, 'GASOLINA', 44326);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 27.75, 6.51, 180.65, 1739384419, 'GASOLINA', 45091);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 22.13, 7.19, 159.11, 1740594019, 'DIESEL', 45372);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Troca de óleo', 1990.47, 1740594019, 'Serviço realizado em Nova Iguaçu/RJ', 45372);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 22.3, 6.32, 140.94, 1741976419, 'GASOLINA_ADITIVADA', 45773);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 30.32, 5.7, 172.82, 1743358819, 'DIESEL', 46566);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 51.08, 6.18, 315.67, 1744482019, 'DIESEL', 47278);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 30.94, 5.87, 181.62, 1745518819, 'GASOLINA_ADITIVADA', 47965);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Estacionamento', 17.38, 1745518819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 46.06, 6.66, 306.76, 1746642019, 'GASOLINA_ADITIVADA', 48313);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 34.38, 7.24, 248.91, 1748110819, 'DIESEL', 48688);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Pastilhas de freio', 335.49, 1748110819, 'Serviço realizado em Petrópolis/RJ', 48688);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 42.99, 5.15, 221.4, 1748974819, 'ETANOL', 49096);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 40.09, 7.19, 288.25, 1750616419, 'DIESEL', 49631);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 21.01, 6.46, 135.72, 1751998819, 'GASOLINA_ADITIVADA', 50154);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 39.82, 5.64, 224.58, 1752776419, 'DIESEL', 50550);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 27.53, 6.41, 176.47, 1754331619, 'DIESEL', 51343);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Estacionamento', 89.38, 1754331619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 25.51, 6.41, 163.52, 1754936419, 'GASOLINA', 51752);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 34.5, 4.94, 170.43, 1756318819, 'ETANOL', 52454);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Estacionamento', 22.2, 1756318819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 21.59, 7.47, 161.28, 1757614819, 'DIESEL', 53019);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Pedágio', 43.16, 1757614819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 30.13, 5.21, 156.98, 1759256419, 'GASOLINA', 53530);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 37.51, 5.33, 199.93, 1760552419, 'GASOLINA_ADITIVADA', 54015);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Rio de Janeiro/RJ', 'leve', 485.39, 1760552419, 1763144419, 3, 'Radar 60 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 44.83, 6.08, 272.57, 1761934819, 'DIESEL', 54679);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Filtro de ar', 1077.0, 1761934819, 'Serviço realizado em Nova Iguaçu/RJ', 54679);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 49.56, 4.2, 208.15, 1762626019, 'ETANOL', 55376);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 31.66, 3.38, 107.01, 1763922019, 'ETANOL', 55852);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 45.46, 3.74, 170.02, 1763922019, 'ETANOL', 56461);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'Pedágio', 29.08, 1763922019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 36.24, 6.86, 248.61, 1763662819, 'DIESEL', 57216);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 25.28, 6.04, 152.69, 1763662819, 'GASOLINA', 57789);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 30.86, 5.58, 172.2, 1763749219, 'DIESEL', 58114);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 33.46, 6.01, 201.09, 1763749219, 'GASOLINA', 58883);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 25.28, 6.01, 151.93, 1763835619, 'GASOLINA', 59646);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'ipva', 'IPVA 2024', 905.68, 1704067200, 1712707200, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'licenciamento', 'Licenciamento 2024', 187.55, 1704067200, 1727049600, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'seguro', 'Seguro 2024/2025', 3368.24, 1723852800, 1755388800, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'ipva', 'IPVA 2025', 1782.52, 1735689600, 1744243200, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'licenciamento', 'Licenciamento 2025', 156.58, 1735689600, 1759190400, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 'seguro', 'Seguro 2025/2026', 2815.1, 1753401600, 1784937600, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 52561, 835, NULL, NULL, 'Viagem planejada', 1750184419);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 3, 49934, 343, NULL, NULL, 'Viagem planejada', 1756837219);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 31.67, 6.67, 211.24, 1718994019, 'DIESEL', 15548);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Estacionamento', 44.13, 1718994019, 1);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Alinhamento e balanceamento', 1357.69, 1718994019, 'Serviço realizado em Rio de Janeiro/RJ', 15548);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 42.52, 6.16, 261.92, 1719944419, 'DIESEL', 16183);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Lava-jato', 101.19, 1719944419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 37.8, 5.54, 209.41, 1721413219, 'DIESEL', 16866);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 26.72, 7.5, 200.4, 1723054819, 'DIESEL', 17613);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Estacionamento', 102.89, 1723054819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 50.67, 6.74, 341.52, 1724523619, 'DIESEL', 18207);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 45.24, 5.59, 252.89, 1726251619, 'DIESEL', 18626);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 46.33, 7.07, 327.55, 1727634019, 'DIESEL', 19167);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 44.04, 1727634019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 32.87, 7.39, 242.91, 1729362019, 'DIESEL', 19615);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 37.6, 6.34, 238.38, 1731003619, 'DIESEL', 20256);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 98.14, 1731003619, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Troca de óleo', 1453.65, 1731003619, 'Serviço realizado em Nova Iguaçu/RJ', 20256);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 44.9, 6.53, 293.2, 1732299619, 'DIESEL', 20611);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 93.94, 1732299619, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 23.21, 7.32, 169.9, 1734027619, 'DIESEL', 21308);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 33.88, 6.25, 211.75, 1735150819, 'DIESEL', 21612);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 52.58, 7.18, 377.52, 1735755619, 'DIESEL', 22188);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 52.11, 6.44, 335.59, 1736360419, 'DIESEL', 22731);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 51.71, 5.54, 286.47, 1737570019, 'DIESEL', 22986);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 70.37, 1737570019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 28.32, 5.74, 162.56, 1738261219, 'DIESEL', 23531);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Lava-jato', 97.33, 1738261219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 40.89, 5.53, 226.12, 1739989219, 'DIESEL', 24292);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 20.05, 6.21, 124.51, 1740939619, 'DIESEL', 24981);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 22.37, 6.55, 146.52, 1742235619, 'DIESEL', 25600);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pneus', 1936.53, 1742235619, 'Serviço realizado em Rio de Janeiro/RJ', 25600);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 54.34, 6.01, 326.58, 1743704419, 'DIESEL', 26246);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 47.93, 1743704419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 24.67, 6.2, 152.95, 1745346019, 'DIESEL', 26836);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 42.11, 7.12, 299.82, 1746901219, 'DIESEL', 27576);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Estacionamento', 14.07, 1746901219, 1);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Troca de óleo', 776.44, 1746901219, 'Serviço realizado em Nova Iguaçu/RJ', 27576);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 54.62, 6.59, 359.95, 1748197219, 'DIESEL', 28233);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 50.17, 5.6, 280.95, 1749147619, 'DIESEL', 28848);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 46.02, 7.29, 335.49, 1750270819, 'DIESEL', 29507);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 32.86, 7.09, 232.98, 1751826019, 'DIESEL', 30266);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 41.09, 7.14, 293.38, 1752517219, 'DIESEL', 30956);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 30.73, 6.71, 206.2, 1753554019, 'DIESEL', 31508);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 45.44, 7.32, 332.62, 1754763619, 'DIESEL', 31801);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 32.72, 7.1, 232.31, 1755454819, 'DIESEL', 32466);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 21.22, 5.63, 119.47, 1757182819, 'DIESEL', 33164);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 41.18, 6.86, 282.49, 1758565219, 'DIESEL', 33447);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 38.53, 6.3, 242.74, 1759947619, 'DIESEL', 33837);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 37.47, 6.27, 234.94, 1760552419, 'DIESEL', 34277);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 27.51, 6.72, 184.87, 1762107619, 'DIESEL', 34983);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 49.85, 6.4, 319.04, 1762798819, 'DIESEL', 35371);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 43.37, 6.92, 300.12, 1763662819, 'DIESEL', 35948);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 47.78, 6.52, 311.53, 1764008419, 'DIESEL', 36376);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 97.13, 1764008419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 36.36, 7.47, 271.61, 1763922019, 'DIESEL', 37003);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'Pedágio', 17.23, 1763922019, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 48.82, 5.65, 275.83, 1763835619, 'DIESEL', 37672);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 32.06, 7.26, 232.76, 1763662819, 'DIESEL', 38451);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 37.6, 7.24, 272.22, 1764008419, 'DIESEL', 39144);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 52.72, 5.95, 313.68, 1764008419, 'DIESEL', 39724);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'ipva', 'IPVA 2024', 1476.63, 1704067200, 1712448000, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'licenciamento', 'Licenciamento 2024', 291.27, 1704067200, 1726876800, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'seguro', 'Seguro 2024/2025', 3675.07, 1714867200, 1746403200, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'ipva', 'IPVA 2025', 2156.95, 1735689600, 1743984000, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'licenciamento', 'Licenciamento 2025', 218.36, 1735689600, 1757116800, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 'seguro', 'Seguro 2025/2026', 2313.6, 1759622400, 1791158400, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 27068, 234, NULL, NULL, 'Viagem planejada', 1751653219);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 25132, 243, NULL, NULL, 'Viagem planejada', 1762366819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 23888, 581, NULL, NULL, 'Viagem planejada', 1749752419);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 4, 23221, 212, NULL, NULL, 'Viagem planejada', 1750443619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 36.9, 6.09, 224.72, 1718389219, 'DIESEL', 44584);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Pedágio', 27.39, 1718389219, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Alinhamento e balanceamento', 827.6, 1718389219, 'Serviço realizado em Niterói/RJ', 44584);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 45.7, 6.96, 318.07, 1719426019, 'GASOLINA_ADITIVADA', 45160);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Estacionamento', 66.65, 1719426019, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 29.36, 3.52, 103.35, 1720635619, 'ETANOL', 45535);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Estacionamento', 105.06, 1720635619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 52.68, 5.54, 291.85, 1722363619, 'GASOLINA_ADITIVADA', 46120);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Lava-jato', 61.35, 1722363619, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 53.08, 7.43, 394.38, 1722968419, 'DIESEL', 46462);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Estacionamento', 15.35, 1722968419, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 20.29, 5.98, 121.33, 1723918819, 'GASOLINA', 47261);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 34.02, 4.03, 137.1, 1724955619, 'ETANOL', 47557);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 48.89, 5.43, 265.47, 1726597219, 'GASOLINA', 48093);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Estacionamento', 97.44, 1726597219, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 26.97, 6.5, 175.31, 1728238819, 'DIESEL', 48490);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Pedágio', 88.5, 1728238819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 24.89, 5.49, 136.65, 1729016419, 'GASOLINA_ADITIVADA', 49267);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 37.76, 6.92, 261.3, 1730398819, 'DIESEL', 49861);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 54.3, 6.63, 360.01, 1731435619, 'GASOLINA_ADITIVADA', 50223);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 29.29, 4.86, 142.35, 1732818019, 'ETANOL', 50958);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 21.1, 5.54, 116.89, 1733595619, 'GASOLINA', 51456);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 34.36, 7.25, 249.11, 1735150819, 'DIESEL', 51914);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Filtro de ar', 551.27, 1735150819, 'Serviço realizado em Nova Iguaçu/RJ', 51914);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 38.39, 6.92, 265.66, 1736619619, 'GASOLINA_ADITIVADA', 52653);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 41.35, 5.4, 223.29, 1738088419, 'ETANOL', 53173);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Pastilhas de freio', 1586.19, 1738088419, 'Serviço realizado em Duque de Caxias/RJ', 53173);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 32.21, 5.72, 184.24, 1739125219, 'GASOLINA_ADITIVADA', 53914);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 53.41, 3.87, 206.7, 1740853219, 'ETANOL', 54517);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 46.16, 3.66, 168.95, 1742062819, 'ETANOL', 55029);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 41.55, 3.76, 156.23, 1742840419, 'ETANOL', 55390);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 34.47, 5.7, 196.48, 1743445219, 'DIESEL', 55742);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Duque de Caxias/RJ', 'media', 439.94, 1743445219, 1746037219, 4, 'Radar 70 km/h');
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Pastilhas de freio', 788.03, 1743445219, 'Serviço realizado em Rio de Janeiro/RJ', 55742);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 42.83, 4.43, 189.74, 1745086819, 'ETANOL', 56083);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 52.69, 6.99, 368.3, 1746210019, 'GASOLINA', 56513);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 30.44, 6.87, 209.12, 1746814819, 'GASOLINA', 56772);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 36.38, 5.06, 184.08, 1747592419, 'ETANOL', 57538);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 20.49, 6.62, 135.64, 1749147619, 'GASOLINA_ADITIVADA', 57978);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 48.94, 5.36, 262.32, 1750530019, 'GASOLINA_ADITIVADA', 58643);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 52.75, 5.67, 299.09, 1751739619, 'GASOLINA', 59224);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Estacionamento', 114.94, 1751739619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 44.25, 6.4, 283.2, 1752690019, 'GASOLINA', 59842);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 42.35, 5.86, 248.17, 1754245219, 'GASOLINA_ADITIVADA', 60212);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Pedágio', 62.6, 1754245219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 46.51, 4.95, 230.22, 1755368419, 'ETANOL', 60944);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 38.49, 5.34, 205.54, 1756664419, 'GASOLINA_ADITIVADA', 61651);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 25.24, 6.74, 170.12, 1758046819, 'GASOLINA_ADITIVADA', 62450);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 35.59, 6.02, 214.25, 1758738019, 'GASOLINA', 63222);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 43.55, 6.5, 283.07, 1760034019, 'GASOLINA_ADITIVADA', 63945);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Filtro de ar', 271.9, 1760034019, 'Serviço realizado em Duque de Caxias/RJ', 63945);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 38.94, 6.88, 267.91, 1761070819, 'GASOLINA', 64260);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Estacionamento', 13.49, 1761070819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 33.11, 6.4, 211.9, 1762712419, 'DIESEL', 64940);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 42.87, 5.41, 231.93, 1763662819, 'GASOLINA_ADITIVADA', 65326);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 46.47, 6.03, 280.21, 1764008419, 'GASOLINA_ADITIVADA', 65579);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 36.12, 3.83, 138.34, 1764008419, 'ETANOL', 66082);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 41.52, 5.63, 233.76, 1763662819, 'GASOLINA', 66761);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Lava-jato', 13.69, 1763662819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 34.08, 4.44, 151.32, 1763662819, 'ETANOL', 67056);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Filtro de ar', 2186.45, 1763662819, 'Serviço realizado em Niterói/RJ', 67056);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 40.21, 5.63, 226.38, 1763662819, 'GASOLINA_ADITIVADA', 67632);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 22.13, 4.64, 102.68, 1763922019, 'ETANOL', 68163);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 47.5, 6.45, 306.38, 1763662819, 'GASOLINA_ADITIVADA', 68803);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 28.43, 3.89, 110.59, 1763749219, 'ETANOL', 69537);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 39.51, 4.09, 161.6, 1763835619, 'ETANOL', 70213);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 38.75, 3.32, 128.65, 1763922019, 'ETANOL', 70557);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Troca de óleo', 511.38, 1763922019, 'Serviço realizado em Petrópolis/RJ', 70557);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 36.78, 5.75, 211.49, 1763662819, 'GASOLINA_ADITIVADA', 71029);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'Bateria', 364.02, 1763662819, 'Serviço realizado em Duque de Caxias/RJ', 71029);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 33.88, 4.47, 151.44, 1763662819, 'ETANOL', 71488);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 37.95, 6.43, 244.02, 1763922019, 'DIESEL', 72106);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'ipva', 'IPVA 2024', 1800.9, 1704067200, 1712793600, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'licenciamento', 'Licenciamento 2024', 109.14, 1704067200, 1726272000, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'seguro', 'Seguro 2024/2025', 2237.77, 1713916800, 1745452800, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'ipva', 'IPVA 2025', 2293.94, 1735689600, 1744502400, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'licenciamento', 'Licenciamento 2025', 215.83, 1735689600, 1758240000, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 'seguro', 'Seguro 2025/2026', 2257.23, 1752105600, 1783641600, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 59787, 927, NULL, NULL, 'Viagem planejada', 1759083619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 59692, 841, NULL, NULL, 'Viagem planejada', 1753122019);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 57782, 1150, NULL, NULL, 'Viagem planejada', 1747246819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 5, 58915, 494, NULL, NULL, 'Viagem planejada', 1753986019);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 26.44, 6.14, 162.34, 1718994019, 'GASOLINA', 80477);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Troca de óleo', 977.78, 1718994019, 'Serviço realizado em Niterói/RJ', 80477);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 20.32, 6.25, 127.0, 1719685219, 'DIESEL', 80881);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 20.55, 5.52, 113.44, 1721154019, 'DIESEL', 81630);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 48.46, 7.11, 344.55, 1721758819, 'DIESEL', 82394);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 28.43, 6.67, 189.63, 1723054819, 'GASOLINA_ADITIVADA', 82796);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 39.78, 3.89, 154.74, 1724178019, 'ETANOL', 83516);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 33.27, 5.61, 186.64, 1724869219, 'DIESEL', 84181);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Pedágio', 19.1, 1724869219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 51.32, 5.61, 287.91, 1726251619, 'GASOLINA', 84528);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 52.35, 6.82, 357.03, 1727202019, 'GASOLINA_ADITIVADA', 84825);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Niterói/RJ', 'grave', 103.47, 1727202019, 1729794019, 5, 'Radar 77 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 52.51, 5.49, 288.28, 1728843619, 'GASOLINA_ADITIVADA', 85482);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Estacionamento', 84.47, 1728843619, 1);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Bateria', 411.1, 1728843619, 'Serviço realizado em Rio de Janeiro/RJ', 85482);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 21.88, 5.96, 130.4, 1730139619, 'DIESEL', 86086);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Lava-jato', 94.59, 1730139619, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 21.04, 6.61, 139.07, 1731781219, 'GASOLINA_ADITIVADA', 86670);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 43.79, 5.67, 248.29, 1732904419, 'DIESEL', 87110);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Troca de óleo', 677.38, 1732904419, 'Serviço realizado em Duque de Caxias/RJ', 87110);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 45.89, 5.85, 268.46, 1734459619, 'GASOLINA_ADITIVADA', 87517);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Estacionamento', 58.92, 1734459619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 26.56, 6.61, 175.56, 1735237219, 'DIESEL', 87856);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 40.89, 6.75, 276.01, 1736274019, 'GASOLINA_ADITIVADA', 88201);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Estacionamento', 52.66, 1736274019, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 25.94, 5.84, 151.49, 1737656419, 'DIESEL', 88984);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 35.21, 6.1, 214.78, 1738347619, 'DIESEL', 89405);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 40.78, 4.25, 173.31, 1739902819, 'ETANOL', 90162);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Pedágio', 114.37, 1739902819, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Pastilhas de freio', 1035.66, 1739902819, 'Serviço realizado em Duque de Caxias/RJ', 90162);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 30.52, 4.3, 131.24, 1741630819, 'ETANOL', 90551);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Estacionamento', 116.56, 1741630819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 31.41, 6.67, 209.5, 1743013219, 'GASOLINA_ADITIVADA', 91049);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 43.86, 6.92, 303.51, 1744395619, 'GASOLINA', 91483);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 49.09, 6.67, 327.43, 1746037219, 'GASOLINA', 92031);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 28.47, 4.85, 138.08, 1746814819, 'ETANOL', 92591);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 38.7, 6.59, 255.03, 1748197219, 'DIESEL', 93251);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Troca de óleo', 1719.42, 1748197219, 'Serviço realizado em Nova Iguaçu/RJ', 93251);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 39.71, 7.43, 295.05, 1748974819, 'DIESEL', 93546);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 29.06, 4.23, 122.92, 1749579619, 'ETANOL', 93896);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 36.9, 5.95, 219.56, 1750616419, 'GASOLINA_ADITIVADA', 94171);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 32.01, 4.4, 140.84, 1751653219, 'ETANOL', 94740);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 30.51, 5.24, 159.87, 1752690019, 'GASOLINA', 95058);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 38.06, 3.96, 150.72, 1754245219, 'ETANOL', 95557);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 26.52, 6.29, 166.81, 1755714019, 'DIESEL', 95995);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 33.61, 3.67, 123.35, 1757096419, 'ETANOL', 96684);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 47.98, 4.04, 193.84, 1758478819, 'ETANOL', 97038);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Pedágio', 38.86, 1758478819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 41.4, 5.83, 241.36, 1759861219, 'GASOLINA', 97685);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 43.52, 5.41, 235.44, 1761243619, 'GASOLINA_ADITIVADA', 98021);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'Filtro de ar', 928.0, 1761243619, 'Serviço realizado em Petrópolis/RJ', 98021);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 34.81, 6.77, 235.66, 1762021219, 'DIESEL', 98663);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 37.14, 3.63, 134.82, 1763317219, 'ETANOL', 99083);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 24.78, 7.43, 184.12, 1763922019, 'DIESEL', 99829);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'ipva', 'IPVA 2024', 2717.38, 1704067200, 1713398400, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'licenciamento', 'Licenciamento 2024', 197.74, 1704067200, 1726358400, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'seguro', 'Seguro 2024/2025', 1892.58, 1708300800, 1739836800, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'ipva', 'IPVA 2025', 1588.64, 1735689600, 1744416000, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'licenciamento', 'Licenciamento 2025', 144.97, 1735689600, 1757376000, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 'seguro', 'Seguro 2025/2026', 4142.22, 1746489600, 1778025600, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 89073, 1196, NULL, NULL, 'Viagem planejada', 1751998819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 87806, 383, NULL, NULL, 'Viagem planejada', 1751480419);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 85560, 901, NULL, NULL, 'Viagem planejada', 1746987619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 86385, 235, NULL, NULL, 'Viagem planejada', 1747419619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 6, 86518, 597, NULL, NULL, 'Viagem planejada', 1752085219);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 30.42, 6.01, 182.82, 1719166819, 'GASOLINA', 111326);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Troca de óleo', 1733.31, 1719166819, 'Serviço realizado em Niterói/RJ', 111326);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 50.14, 5.83, 292.32, 1720030819, 'DIESEL', 111935);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pedágio', 99.49, 1720030819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 40.89, 3.94, 161.11, 1721326819, 'ETANOL', 112472);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 54.49, 5.44, 296.43, 1723054819, 'GASOLINA', 113248);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 44.55, 3.77, 167.95, 1724005219, 'ETANOL', 113627);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 40.21, 6.33, 254.53, 1725214819, 'GASOLINA_ADITIVADA', 114022);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 46.24, 6.02, 278.36, 1726338019, 'GASOLINA_ADITIVADA', 114799);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Bateria', 2142.07, 1726338019, 'Serviço realizado em Nova Iguaçu/RJ', 114799);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 47.85, 5.94, 284.23, 1728066019, 'DIESEL', 115113);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 31.82, 4.5, 143.19, 1729102819, 'ETANOL', 115653);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 41.92, 5.53, 231.82, 1729707619, 'DIESEL', 116004);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Troca de óleo', 2183.02, 1729707619, 'Serviço realizado em Duque de Caxias/RJ', 116004);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 50.88, 5.49, 279.33, 1730571619, 'GASOLINA_ADITIVADA', 116389);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 33.01, 3.32, 109.59, 1731522019, 'ETANOL', 116723);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 44.63, 5.58, 249.04, 1732645219, 'GASOLINA', 117066);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Lava-jato', 34.88, 1732645219, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Troca de óleo', 1566.84, 1732645219, 'Serviço realizado em Rio de Janeiro/RJ', 117066);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 44.29, 5.64, 249.8, 1734373219, 'DIESEL', 117748);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 32.86, 5.45, 179.09, 1735064419, 'GASOLINA_ADITIVADA', 118318);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Bateria', 2185.32, 1735064419, 'Serviço realizado em Niterói/RJ', 118318);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 39.72, 4.21, 167.22, 1735755619, 'ETANOL', 119111);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 50.1, 6.81, 341.18, 1736878819, 'GASOLINA', 119814);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pedágio', 74.85, 1736878819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 28.67, 5.65, 161.99, 1737915619, 'GASOLINA', 120207);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 49.68, 5.57, 276.72, 1739557219, 'GASOLINA_ADITIVADA', 120484);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pastilhas de freio', 1464.03, 1739557219, 'Serviço realizado em Niterói/RJ', 120484);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 23.95, 6.78, 162.38, 1740766819, 'DIESEL', 121129);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pedágio', 118.56, 1740766819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 32.79, 4.95, 162.31, 1741890019, 'ETANOL', 121809);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 20.48, 3.29, 67.38, 1743272419, 'ETANOL', 122128);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Estacionamento', 65.73, 1743272419, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 22.88, 3.84, 87.86, 1744395619, 'ETANOL', 122789);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 38.77, 6.67, 258.6, 1746037219, 'DIESEL', 123198);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 45.55, 3.33, 151.68, 1746987619, 'ETANOL', 123895);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Estacionamento', 22.76, 1746987619, 1);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pastilhas de freio', 1505.45, 1746987619, 'Serviço realizado em Niterói/RJ', 123895);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 44.78, 5.49, 245.84, 1747678819, 'GASOLINA', 124157);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 24.44, 6.52, 159.35, 1748456419, 'GASOLINA_ADITIVADA', 124787);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pedágio', 46.85, 1748456419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 37.37, 5.3, 198.06, 1749406819, 'GASOLINA_ADITIVADA', 125115);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 51.3, 5.61, 287.79, 1750357219, 'GASOLINA', 125470);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Duque de Caxias/RJ', 'leve', 300.31, 1750357219, 1752949219, 3, 'Radar 63 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 52.59, 6.2, 326.06, 1751134819, 'GASOLINA', 125903);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 28.69, 5.69, 163.25, 1751998819, 'GASOLINA_ADITIVADA', 126482);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Estacionamento', 23.13, 1751998819, 1);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Alinhamento e balanceamento', 584.22, 1751998819, 'Serviço realizado em Petrópolis/RJ', 126482);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 22.41, 7.23, 162.02, 1752603619, 'DIESEL', 127142);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 20.28, 3.87, 78.48, 1753899619, 'ETANOL', 127859);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 40.71, 7.5, 305.32, 1755109219, 'DIESEL', 128486);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 52.63, 5.62, 295.78, 1755886819, 'GASOLINA', 128742);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 46.56, 7.2, 335.23, 1756923619, 'DIESEL', 128993);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pneus', 1143.42, 1756923619, 'Serviço realizado em Rio de Janeiro/RJ', 128993);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 23.26, 5.26, 122.35, 1757701219, 'ETANOL', 129529);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 40.33, 4.67, 188.34, 1758910819, 'ETANOL', 129865);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 28.29, 6.73, 190.39, 1760034019, 'GASOLINA_ADITIVADA', 130248);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 29.52, 6.9, 203.69, 1761070819, 'GASOLINA', 130961);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Lava-jato', 21.99, 1761070819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 34.23, 6.94, 237.56, 1762280419, 'GASOLINA_ADITIVADA', 131532);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Estacionamento', 60.97, 1762280419, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 48.92, 5.59, 273.46, 1763058019, 'GASOLINA', 132093);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 37.97, 5.67, 215.29, 1764094819, 'GASOLINA_ADITIVADA', 132748);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Petrópolis/RJ', 'gravissima', 824.96, 1764094819, 1766686819, 7, 'Radar 75 km/h');
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Troca de óleo', 1081.05, 1764094819, 'Serviço realizado em Niterói/RJ', 132748);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 49.06, 3.5, 171.71, 1764094819, 'ETANOL', 133061);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 52.11, 5.24, 273.06, 1763749219, 'GASOLINA', 133576);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Lava-jato', 58.78, 1763749219, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 21.77, 7.14, 155.44, 1764094819, 'DIESEL', 134298);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Niterói/RJ', 'gravissima', 238.61, 1764094819, 1766686819, 7, 'Radar 51 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 21.21, 4.69, 99.47, 1763835619, 'ETANOL', 134700);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 33.41, 5.9, 197.12, 1764094819, 'DIESEL', 135236);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 36.79, 6.19, 227.73, 1763662819, 'DIESEL', 135853);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Alinhamento e balanceamento', 174.21, 1763662819, 'Serviço realizado em Petrópolis/RJ', 135853);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 22.05, 6.56, 144.65, 1764094819, 'DIESEL', 136390);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Troca de óleo', 635.54, 1764094819, 'Serviço realizado em Niterói/RJ', 136390);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 46.74, 4.52, 211.26, 1763749219, 'ETANOL', 136697);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 48.22, 6.85, 330.31, 1764008419, 'GASOLINA_ADITIVADA', 137272);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Lava-jato', 48.69, 1764008419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 38.97, 4.33, 168.74, 1764008419, 'ETANOL', 138026);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pedágio', 76.18, 1764008419, 0);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Petrópolis/RJ', 'gravissima', 90.59, 1764008419, 1766600419, 7, 'Radar 52 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 52.16, 5.31, 276.97, 1763662819, 'GASOLINA_ADITIVADA', 138457);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Lava-jato', 110.89, 1763662819, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 40.51, 5.74, 232.53, 1763922019, 'GASOLINA_ADITIVADA', 139112);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Pedágio', 90.56, 1763922019, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Bateria', 779.95, 1763922019, 'Serviço realizado em Petrópolis/RJ', 139112);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 27.81, 4.07, 113.19, 1763749219, 'ETANOL', 139727);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 49.78, 5.53, 275.28, 1764094819, 'GASOLINA', 140377);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'Bateria', 1296.34, 1764094819, 'Serviço realizado em Duque de Caxias/RJ', 140377);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 28.33, 5.5, 155.81, 1763922019, 'GASOLINA_ADITIVADA', 140706);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'ipva', 'IPVA 2024', 830.77, 1704067200, 1713484800, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'licenciamento', 'Licenciamento 2024', 149.91, 1704067200, 1725667200, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'seguro', 'Seguro 2024/2025', 2569.97, 1707696000, 1739232000, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'ipva', 'IPVA 2025', 2745.12, 1735689600, 1744070400, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'licenciamento', 'Licenciamento 2025', 177.19, 1735689600, 1756771200, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 'seguro', 'Seguro 2025/2026', 4707.31, 1765670400, 1797206400, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 117123, 925, NULL, NULL, 'Viagem planejada', 1753208419);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 119170, 918, NULL, NULL, 'Viagem planejada', 1752085219);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 118668, 611, NULL, NULL, 'Viagem planejada', 1753554019);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 119727, 300, NULL, NULL, 'Viagem planejada', 1754158819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 7, 117390, 191, NULL, NULL, 'Viagem planejada', 1757614819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 25.95, 5.82, 151.03, 1718130019, 'DIESEL', 58522);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Pedágio', 47.17, 1718130019, 0);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Bateria', 184.47, 1718130019, 'Serviço realizado em Niterói/RJ', 58522);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 25.5, 5.8, 147.9, 1719512419, 'GASOLINA', 59216);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 30.41, 5.29, 160.87, 1720981219, 'GASOLINA', 59754);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 20.13, 5.73, 115.34, 1721586019, 'GASOLINA', 60373);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 27.24, 6.96, 189.59, 1722277219, 'GASOLINA_ADITIVADA', 60649);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 51.32, 5.36, 275.08, 1723486819, 'GASOLINA_ADITIVADA', 61399);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 35.6, 5.99, 213.24, 1724523619, 'GASOLINA_ADITIVADA', 61840);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Alinhamento e balanceamento', 1684.65, 1724523619, 'Serviço realizado em Rio de Janeiro/RJ', 61840);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 48.29, 7.44, 359.28, 1725214819, 'DIESEL', 62442);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 34.65, 6.65, 230.42, 1726942819, 'DIESEL', 63227);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Estacionamento', 18.69, 1726942819, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 48.02, 3.48, 167.11, 1728238819, 'ETANOL', 64006);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 24.42, 5.66, 138.22, 1729102819, 'DIESEL', 64453);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 31.19, 5.36, 167.18, 1730830819, 'GASOLINA', 64967);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 52.1, 6.62, 344.9, 1732126819, 'GASOLINA', 65686);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 25.24, 6.86, 173.15, 1732818019, 'GASOLINA', 66360);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 50.8, 6.03, 306.32, 1734546019, 'DIESEL', 67158);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 29.64, 4.62, 136.94, 1735150819, 'ETANOL', 67584);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 21.73, 7.34, 159.5, 1736187619, 'DIESEL', 68077);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Duque de Caxias/RJ', 'grave', 357.42, 1736187619, 1738779619, 5, 'Radar 46 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 54.1, 7.05, 381.4, 1736965219, 'DIESEL', 68634);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 27.4, 6.98, 191.25, 1737829219, 'DIESEL', 69336);
INSERT INTO maintenances (ownerId, vehicleId, title, cost, date, notes, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Filtro de ar', 1766.3, 1737829219, 'Serviço realizado em Rio de Janeiro/RJ', 69336);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 34.12, 5.51, 188.0, 1738779619, 'GASOLINA', 70104);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 35.98, 6.47, 232.79, 1739643619, 'GASOLINA_ADITIVADA', 70387);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 43.84, 4.06, 177.99, 1741112419, 'ETANOL', 70763);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 32.05, 6.55, 209.93, 1742494819, 'GASOLINA_ADITIVADA', 71371);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 49.88, 5.17, 257.88, 1743099619, 'ETANOL', 71787);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 37.96, 6.05, 229.66, 1744568419, 'GASOLINA', 72456);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Pedágio', 76.13, 1744568419, 0);
INSERT INTO fines (ownerId, vehicleId, location, severity, value, date, dueDate, points, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Nova Iguaçu/RJ', 'grave', 613.18, 1744568419, 1747160419, 5, 'Radar 57 km/h');
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 36.06, 4.27, 153.98, 1745691619, 'ETANOL', 73063);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 20.26, 6.21, 125.81, 1747074019, 'GASOLINA_ADITIVADA', 73417);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 31.77, 6.35, 201.74, 1748283619, 'GASOLINA_ADITIVADA', 73732);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 38.11, 5.27, 200.84, 1749147619, 'ETANOL', 74135);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 43.83, 6.38, 279.64, 1750616419, 'GASOLINA', 74712);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 45.79, 3.99, 182.7, 1751739619, 'ETANOL', 75359);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 37.76, 5.13, 193.71, 1753208419, 'ETANOL', 75976);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 45.93, 5.38, 247.1, 1754418019, 'ETANOL', 76357);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 46.05, 5.96, 274.46, 1755454819, 'GASOLINA_ADITIVADA', 76835);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 36.47, 6.05, 220.64, 1756664419, 'GASOLINA', 77205);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Pedágio', 105.42, 1756664419, 0);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 50.48, 3.52, 177.69, 1757787619, 'ETANOL', 77510);
INSERT INTO expenses (ownerId, vehicleId, title, cost, date, isRecurringMonthly) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'Estacionamento', 118.59, 1757787619, 1);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 50.18, 4.99, 250.4, 1758565219, 'ETANOL', 78083);
INSERT INTO refuelings (ownerId, vehicleId, liters, pricePerLiter, total, date, fuelType, mileage) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 20.16, 5.58, 112.49, 1759602019, 'GASOLINA_ADITIVADA', 78392);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'ipva', 'IPVA 2024', 2920.07, 1704067200, 1713571200, 1, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'licenciamento', 'Licenciamento 2024', 117.61, 1704067200, 1727222400, 1, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'seguro', 'Seguro 2024/2025', 3700.46, 1728864000, 1760400000, 1, 'Cobertura compreensiva');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'ipva', 'IPVA 2025', 1958.37, 1735689600, 1744848000, 0, 'Cota única');
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'licenciamento', 'Licenciamento 2025', 176.66, 1735689600, 1757980800, 0, NULL);
INSERT INTO documents (ownerId, vehicleId, type, title, value, startDate, dueDate, isPaid, notes) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 'seguro', 'Seguro 2025/2026', 2398.24, 1737158400, 1768694400, 0, 'Cobertura compreensiva');
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 65350, 809, NULL, NULL, 'Viagem planejada', 1763835619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 69667, 186, NULL, NULL, 'Viagem planejada', 1759947619);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 67847, 659, NULL, NULL, 'Viagem planejada', 1750270819);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
INSERT INTO trip_checklists (ownerId, vehicleId, startOdo, plannedKm, endOdo, fuelSpentL, notes, createdAt) VALUES ('b77883f0-1d76-4103-aab9-08e1c7398f75', 8, 67144, 855, NULL, NULL, 'Viagem planejada', 1748802019);
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'oleo', 'Óleo verificado', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'pneus', 'Pneus calibrados', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'ferramentas', 'Ferramentas e triângulo', 0;
INSERT INTO trip_checklist_items (checklistId, key, label, checked) SELECT (SELECT MAX(id) FROM trip_checklists), 'documentos', 'Documentos do veículo', 0;
COMMIT;