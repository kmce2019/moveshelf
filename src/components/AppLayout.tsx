import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <header className="app-header no-print">
        <div>
          <p className="eyebrow">Moving inventory</p>
          <h1>MoveShelf</h1>
        </div>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/boxes">Boxes</NavLink>
          <NavLink to="/boxes/new">Add Box</NavLink>
          <NavLink to="/labels">Labels</NavLink>
          <NavLink to="/open-first">Open First</NavLink>
          <NavLink to="/import">Import</NavLink>
          <NavLink to="/report">Report</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
