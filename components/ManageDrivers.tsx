import DriversToolbar from "../components/DriversToolbar";
import DriversStats from "../components/DriversStats";
import DriversTable from "../components/DriversTable";

export default function ManageDrivers() {
  return (
    <section className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <DriversToolbar />
      <DriversStats />
      <DriversTable />
    </section>
  );
}
