import TruckModel from "./TruckModel";

function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-line">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent" />
        <span className="font-semibold text-ink">ELD Trip Planner</span>
      </div>
    </header>
  );
}

export default TopBar;