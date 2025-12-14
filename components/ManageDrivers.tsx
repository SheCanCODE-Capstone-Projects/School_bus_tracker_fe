import DriversToolbar from "../components/DriversToolbar";
import DriversStats from "../components/DriversStats";
import DriversTable from "../components/DriversTable";

export default function ManageDrivers() {
  return (
    <section className="space-y-6">
      <DriversToolbar />
      <DriversStats />
      <DriversTable />
    </section>
  );
}
