import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingError } from '../components/LoadingError';
import { fetchBoxes, filterBoxes, updateBoxStatus } from '../lib/boxes';
import { boxesToCsv, downloadCsv } from '../lib/csv';
import { statuses, type BoxStatus, type MoveBox } from '../types';

export function BoxesList() {
  const [boxes, setBoxes] = useState<MoveBox[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => fetchBoxes().then(setBoxes).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => filterBoxes(boxes, query), [boxes, query]);

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const changeStatus = async (box: MoveBox, status: BoxStatus) => {
    await updateBoxStatus(box.id, status);
    await load();
  };

  return (
    <div className="stack">
      <div className="section-heading">
        <h2>Boxes</h2>
        <div className="button-row">
          <button className="secondary" onClick={() => downloadCsv('moveshelf-boxes.csv', boxesToCsv(boxes))}>Export CSV</button>
          <button disabled={!selected.length} onClick={() => navigate('/labels', { state: { selectedIds: selected } })}>Print selected</button>
        </div>
      </div>
      <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search boxes, rooms, status, priority..." />
      <LoadingError loading={loading} error={error} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Select</th><th>Box</th><th>Contents</th><th>Destination</th><th>Status</th><th>Priority</th><th>Update</th></tr>
          </thead>
          <tbody>
            {filtered.map((box) => (
              <tr key={box.id}>
                <td><input type="checkbox" checked={selected.includes(box.id)} onChange={() => toggle(box.id)} /></td>
                <td><Link to={`/box/${box.box_number}`}>{box.box_number}</Link></td>
                <td>{box.title || box.contents}</td>
                <td>{box.destination_room}</td>
                <td>{box.status}</td>
                <td>{box.priority}</td>
                <td>
                  <select value={box.status} onChange={(event) => changeStatus(box, event.target.value as BoxStatus)}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
