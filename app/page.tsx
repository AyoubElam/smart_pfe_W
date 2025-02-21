import Dashboard from "../app/components/Dashboard/dashboard";

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-4xl font-bold">GESTION DE PFE</h2>
      </div>
      <Dashboard />
    </div>
  );
}