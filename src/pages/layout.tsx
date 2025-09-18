import { Header } from "@/components/header";
import { Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <Header />
      <main className="flex-grow p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </>
  )
}