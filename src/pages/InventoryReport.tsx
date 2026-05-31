import { useEffect, useState } from 'react';
import { fetchBoxes } from '../lib/boxes';
import type { MoveBox } from '../types';

export function InventoryReport() {
  const [boxes, setBoxes] = useState<MoveBox[]>([]);
  useEffect(() => { fetchBoxes().then(setBoxes); }, []);

  return (
    <div className="stack report-page">
      <div className="section-heading no-print">
        <h2>Full Inventory Report</h2>
        <button onClick={() => window.print()}>Print report</button>
      </div>
      <h2 className="print-only">MoveShelf Full Inventory Report</h2>
      <table>
        <thead><tr><th>Box</th><th>Title</th><th>Contents</th><th>From</th><th>To</th><th>Location</th><th>Status</th><th>Priority</th></tr></thead>
        <tbody>
          {boxes.map((box) => (
            <tr key={box.id}>
              <td>{box.box_number}</td><td>{box.title}</td><td>{box.contents}</td><td>{box.origin_room}</td><td>{box.destination_room}</td><td>{box.current_location}</td><td>{box.status}</td><td>{box.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
