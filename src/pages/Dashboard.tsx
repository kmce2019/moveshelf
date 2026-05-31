import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BoxCard } from '../components/BoxCard';
import { LoadingError } from '../components/LoadingError';
import { fetchBoxes, filterBoxes } from '../lib/boxes';
import type { MoveBox } from '../types';

const urgentPriorities = ['Open First', 'Important', 'Critical'];
const searchFields: (keyof MoveBox)[] = ['box_number', 'title', 'contents', 'category', 'origin_room', 'destination_room', 'current_location', 'notes'];

function matchingText(box: MoveBox, query: string) {
  const q = query.trim().toLowerCase();
  const found = searchFields.map((field) => box[field]).find((value) => String(value || '').toLowerCase().includes(q));
  return String(found || box.title || box.contents || box.box_number);
}

export function Dashboard() {
  const [boxes, setBoxes] = useState<MoveBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchBoxes().then(setBoxes).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const byStatus = boxes.reduce<Record<string, number>>((acc, box) => ({ ...acc, [box.status]: (acc[box.status] || 0) + 1 }), {});
    return {
      byStatus,
      urgent: boxes.filter((box) => urgentPriorities.includes(box.priority)).length,
    };
  }, [boxes]);

  const results = useMemo(() => filterBoxes(boxes, query).slice(0, 24), [boxes, query]);
  const recent = [...boxes].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6);

  return (
    <div className="stack">
      <section className="hero-panel no-print">
        <div>
          <p className="eyebrow">Where is it?</p>
          <h2>Find any box, room, or item fast.</h2>
        </div>
        <input
          className="big-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What are you looking for?"
          autoFocus
        />
      </section>
      <LoadingError loading={loading} error={error} />
      {query.trim() && (
        <section className="stack">
          <h2>Search results</h2>
          {results.length ? (
            <div className="result-list">
              {results.map((box) => (
                <Link className="search-result" to={`/box/${box.box_number}`} key={box.id}>
                  <strong>{matchingText(box, query)}</strong>
                  <span>{box.box_number}</span>
                  <span>{box.destination_room || 'Destination TBD'}</span>
                  <span>{box.current_location || 'Location TBD'}</span>
                  <span>{box.status}</span>
                  <span>{box.priority}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty">No boxes found. Try another word, room, or item.</p>
          )}
        </section>
      )}
      <section className="stats-grid">
        {Object.entries(counts.byStatus).map(([status, count]) => (
          <div className="stat" key={status}>
            <span>{status}</span>
            <strong>{count}</strong>
          </div>
        ))}
        <Link className="stat urgent-link" to="/open-first">
          <span>Open First / Important / Critical</span>
          <strong>{counts.urgent}</strong>
        </Link>
      </section>
      <section className="stack">
        <div className="section-heading">
          <h2>Recent boxes</h2>
          <Link to="/boxes">View all</Link>
        </div>
        <div className="card-grid">
          {recent.map((box) => <BoxCard box={box} key={box.id} />)}
        </div>
      </section>
    </div>
  );
}
