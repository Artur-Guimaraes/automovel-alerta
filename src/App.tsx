// App.tsx (ou onde monta o Router)
import { BrowserRouter, Routes, Route } from "react-router-dom"; // <-- dom
import { AuthLayout } from "./pages/auth/auth-layout";
import { SignUp } from "./pages/auth/sign-up";
import { SignIn } from "./pages/auth/sign-in";
import { MyVehicles } from "./pages/my-vehicles";
import { Maintenance } from "./pages/maintenance";
import { Layout } from "./pages/layout";
import { Home } from "./pages/home";
import Refueling from "./pages/refueling";
import Expenses from "./pages/expenses";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {" "}
      {/* <-- Vite */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="refueling" element={<Refueling />} />
          <Route path="expenses" element={<Expenses />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="register" element={<SignUp />} />
          <Route path="login" element={<SignIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
