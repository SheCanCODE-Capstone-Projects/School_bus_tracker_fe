import AdminDriverNavbar from "@/components/AdminDriverNavbar";
import AdminFooter from "@/components/navigation/AdminFooter";
import ManageDrivers from "@/components/ManageDrivers";

export default function AdminDriverDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 ">
      <AdminDriverNavbar />

      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 m-6">
        <ManageDrivers />
      </main>

      <AdminFooter />
    </div>
  );
}