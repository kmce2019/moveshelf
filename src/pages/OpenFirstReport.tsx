import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoxes } from '../lib/boxes';
import type { MoveBox } from '../types';

const urgentPriorities = ['Open First', 'Important', 'Critical'];

export function OpenFirstReport() {
  const [boxes, setBoxes] = useState<MoveBox[]>([]);
  useEffect(() => { fetchBoxes().then(setBoxes); }, []);

  const grouped = useMemo(() => {
    return boxes
      .filter((box) => urgentPriorities.includes(box.priority))
      .reduce<Record<string, MoveBox[]>>((acc, box) => {
        const room = box.destination_room || 'Destination TBD';
        acc[room] = [...(acc[room] || []), box];
        return acc;
      }, {});
  }, [boxes]);

  return (
    <div className="stack report-page">
      <div className="section-heading no-print">
        <h2>Open First Report</h2>
        <button onClick={() => window.print()}>Print report</button>
      </div>
      <h2 className="print-only">Open First / Important / Critical Boxes</h2>
      {Object.entries(grouped).map(([room, roomBoxes]) => (
        <section className="report-group" key={room}>
          <h3>{room}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Box</th><th>Title</th><th>Contents</th><th>Current location</th><th>Status</th></tr></thead>
              <tbody>
                {roomBoxes.map((box) => (
                  <tr key={box.id}>
                    <td><Link to={`/box/${box.box_number}`}>{box.box_number}</Link></td>
                    <td>{box.title}</td>
                    <td>{box.contents}</td>
                    <td>{box.current_location}</td>
                    <td>{box.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {!Object.keys(grouped).length && <p className="empty">No Open First, Important, or Critical boxes yet.</p>}
    </div>
  );
}
