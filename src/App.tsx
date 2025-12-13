// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthLayout } from "./pages/auth/auth-layout";
import { SignIn } from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";

import { Layout } from "./pages/layout";
import { Home } from "./pages/home";
import { MyVehicles } from "./pages/my-vehicles";
import Refueling from "./pages/refueling";
import Expenses from "./pages/expenses";
import { Maintenance } from "./pages/maintenance";
import Comparator from "./pages/comparator";
import TripChecklist from "./pages/trip-checklist";
import Fines from "./pages/fines";

import { Toaster } from "sonner";

export function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />

      <Routes>
        {/* Rotas públicas (login/cadastro) */}
        <Route element={<AuthLayout />}>
          {/* AGORA a raiz (/) já abre direto a tela com login do Google */}
          <Route path="/" element={<SignUp />} />
          {/* Alias opcional se você acessar /register direto */}
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
        </Route>

        {/* Rotas logadas (aplicação em si) */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="refueling" element={<Refueling />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="comparator" element={<Comparator />} />
          <Route path="checklist" element={<TripChecklist />} />
          <Route path="fines" element={<Fines />} />
        </Route>

        {/* Qualquer rota desconhecida volta pra raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
