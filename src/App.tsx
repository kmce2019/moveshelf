import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AddBox } from './pages/AddBox';
import { BoxDetail } from './pages/BoxDetail';
import { BoxesList } from './pages/BoxesList';
import { CsvImport } from './pages/CsvImport';
import { Dashboard } from './pages/Dashboard';
import { EditBox } from './pages/EditBox';
import { InventoryReport } from './pages/InventoryReport';
import { OpenFirstReport } from './pages/OpenFirstReport';
import { PrintLabels } from './pages/PrintLabels';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'boxes', element: <BoxesList /> },
      { path: 'boxes/new', element: <AddBox /> },
      { path: 'box/:boxNumber', element: <BoxDetail /> },
      { path: 'box/:boxNumber/edit', element: <EditBox /> },
      { path: 'labels', element: <PrintLabels /> },
      { path: 'import', element: <CsvImport /> },
      { path: 'report', element: <InventoryReport /> },
      { path: 'open-first', element: <OpenFirstReport /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
