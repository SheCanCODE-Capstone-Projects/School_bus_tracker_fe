
import Image from "next/image";
import ParentRegistration from "./register/parent/step1/page";
import LoginPage from "./login/page";
import AdminDashboardHeader from "@/components/navigation/AdminNavbar";

export default function Home() {
  return (

        <div>
          <LoginPage />
          {/* <AdminDashboardHeader /> */}
          
    </div>
  );
}
