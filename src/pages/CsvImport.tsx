import { useEffect, useMemo, useState } from 'react';
import { createBox, fetchBoxes } from '../lib/boxes';
import { parseCsv, rowToBoxInput } from '../lib/csv';
import type { BoxInput, MoveBox } from '../types';

export function CsvImport() {
  const [existing, setExisting] = useState<MoveBox[]>([]);
  const [rows, setRows] = useState<BoxInput[]>([]);
  const [message, setMessage] = useState('');
  useEffect(() => { fetchBoxes().then(setExisting); }, []);

  const duplicates = useMemo(() => {
    const seen = new Set(existing.map((box) => box.box_number));
    return rows.filter((row) => seen.has(row.box_number) || rows.filter((item) => item.box_number === row.box_number).length > 1).map((row) => row.box_number);
  }, [existing, rows]);

  const readFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setRows(parseCsv(text).map(rowToBoxInput).filter((row) => row.box_number));
  };

  const importRows = async () => {
    if (duplicates.length) return;
    for (const row of rows) await createBox(row);
    setMessage(`Imported ${rows.length} boxes.`);
    setRows([]);
  };

  return (
    <div className="stack">
      <h2>CSV Import</h2>
      <input type="file" accept=".csv,text/csv" onChange={(event) => readFile(event.target.files?.[0])} />
      {duplicates.length > 0 && <p className="notice error">Duplicate box_number values: {duplicates.join(', ')}</p>}
      {message && <p className="notice">{message}</p>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Box</th><th>Title</th><th>Destination</th><th>Contents</th><th>Status</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.box_number}><td>{row.box_number}</td><td>{row.title}</td><td>{row.destination_room}</td><td>{row.contents}</td><td>{row.status}</td></tr>)}</tbody>
        </table>
      </div>
      <button disabled={!rows.length || duplicates.length > 0} onClick={importRows}>Import previewed boxes</button>
    </div>
  );
}
