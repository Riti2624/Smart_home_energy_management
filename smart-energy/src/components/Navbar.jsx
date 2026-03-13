import ThemeToggle from "./ThemeToggle";

export default function Navbar({ setPage }) {
  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("devices")}>Devices</button>
        <button onClick={() => setPage("analytics")}>Analytics</button>
        <button onClick={() => setPage("reports")}>Reports</button>
      </div>
      <ThemeToggle />
    </div>
  );
}