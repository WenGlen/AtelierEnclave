import { Outlet } from "react-router-dom"
import Header from "@/components/sections/common/Header"
import Footer from "@/components/sections/common/Footer"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Outlet 代表各頁面內容 */}
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
