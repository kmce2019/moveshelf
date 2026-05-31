import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LabelSheet } from '../components/LabelSheet';
import { LoadingError } from '../components/LoadingError';
import { fetchBoxes, markLabelsPrinted } from '../lib/boxes';
import { priorities, statuses, type MoveBox } from '../types';

type Mode = 'all' | 'selected' | 'unprinted' | 'status' | 'room' | 'priority' | 'range';

export function PrintLabels() {
  const location = useLocation();
  const selectedIds = useMemo(() => (location.state as { selectedIds?: string[] } | null)?.selectedIds || [], [location.state]);
  const [boxes, setBoxes] = useState<MoveBox[]>([]);
  const [mode, setMode] = useState<Mode>(selectedIds.length ? 'selected' : 'unprinted');
  const [filter, setFilter] = useState('');
  const [rangeStart, setRangeStart] = useState('BOX-001');
  const [rangeEnd, setRangeEnd] = useState('BOX-030');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => fetchBoxes().then(setBoxes).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const labelBoxes = useMemo(() => {
    const inRange = (box: MoveBox) => box.box_number >= rangeStart.toUpperCase() && box.box_number <= rangeEnd.toUpperCase();
    if (mode === 'selected') return boxes.filter((box) => selectedIds.includes(box.id));
    if (mode === 'unprinted') return boxes.filter((box) => !box.label_printed);
    if (mode === 'status') return boxes.filter((box) => box.status === filter);
    if (mode === 'room') return boxes.filter((box) => (box.destination_room || '').toLowerCase() === filter.toLowerCase());
    if (mode === 'priority') return boxes.filter((box) => box.priority === filter);
    if (mode === 'range') return boxes.filter(inRange);
    return boxes;
  }, [boxes, filter, mode, rangeEnd, rangeStart, selectedIds]);

  const rooms = [...new Set(boxes.map((box) => box.destination_room).filter(Boolean))] as string[];
  const markPrinted = async () => {
    await markLabelsPrinted(labelBoxes.map((box) => box.id));
    await load();
  };

  return (
    <div className="stack">
      <section className="toolbar no-print">
        <h2>Print Labels</h2>
        <select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
          <option value="all">All boxes</option>
          <option value="selected">Selected boxes</option>
          <option value="unprinted">Unprinted boxes</option>
          <option value="status">By status</option>
          <option value="room">By destination room</option>
          <option value="priority">By priority</option>
          <option value="range">Range</option>
        </select>
        {mode === 'status' && <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Choose status</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>}
        {mode === 'room' && <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Choose room</option>{rooms.map((item) => <option key={item}>{item}</option>)}</select>}
        {mode === 'priority' && <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Choose priority</option>{priorities.map((item) => <option key={item}>{item}</option>)}</select>}
        {mode === 'range' && <><input value={rangeStart} onChange={(event) => setRangeStart(event.target.value)} /><input value={rangeEnd} onChange={(event) => setRangeEnd(event.target.value)} /></>}
        <button onClick={() => window.print()}>Print</button>
        <button className="secondary" onClick={markPrinted}>Mark selected labels as printed</button>
        <p className="muted">Save as PDF: choose Print, then select Save as PDF in your browser print dialog.</p>
      </section>
      <LoadingError loading={loading} error={error} />
      <LabelSheet boxes={labelBoxes} />
    </div>
  );
}
