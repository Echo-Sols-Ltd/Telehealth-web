import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { WelcomeBanner } from "./components/welcome";
import { QuickActions } from "./components/quick-actions";
import { HealthMetrics } from "./components/health-metrics";
import { MyAppointments } from "./components/my-appointments";

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Header />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full">
            <WelcomeBanner />
            <QuickActions />
            <HealthMetrics />
            <MyAppointments />
          </div>
        </div>
      </main>
    </div>
  );
}
