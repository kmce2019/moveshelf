import { QRCodeSVG } from 'qrcode.react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { LoadingError } from '../components/LoadingError';
import { fetchBoxByNumber, updateBoxStatus } from '../lib/boxes';
import { publicAppUrl } from '../lib/supabase';
import { statuses, type BoxStatus, type MoveBox } from '../types';

export function BoxDetail() {
  const { boxNumber = '' } = useParams();
  const [box, setBox] = useState<MoveBox | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = useCallback(() => fetchBoxByNumber(boxNumber).then(setBox).catch((err) => setError(err.message)).finally(() => setLoading(false)), [boxNumber]);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (status: BoxStatus) => {
    if (!box) return;
    await updateBoxStatus(box.id, status);
    await load();
  };

  if (loading || error) return <LoadingError loading={loading} error={error} />;
  if (!box) return <p className="notice error">Box not found.</p>;

  return (
    <div className="detail-layout">
      <section className="detail-main">
        <p className="eyebrow">{box.status}</p>
        <h2>{box.box_number}</h2>
        <h3>{box.title || 'Untitled box'}</h3>
        <dl className="detail-list">
          <dt>Contents</dt><dd>{box.contents || 'No contents listed'}</dd>
          <dt>Route</dt><dd>{box.origin_room || 'Origin TBD'} to {box.destination_room || 'Destination TBD'}</dd>
          <dt>Current location</dt><dd>{box.current_location || 'Location TBD'}</dd>
          <dt>Priority</dt><dd>{box.priority}{box.fragile ? ' / Fragile' : ''}</dd>
          <dt>Category</dt><dd>{box.category || 'None'}</dd>
          <dt>Notes</dt><dd>{box.notes || 'None'}</dd>
        </dl>
        <div className="button-row no-print">
          {statuses.filter((status) => status !== 'Planned').map((status) => <button className="secondary" key={status} onClick={() => setStatus(status)}>{status}</button>)}
        </div>
        <div className="button-row no-print">
          <Link className="button" to={`/box/${box.box_number}/edit`}>Edit</Link>
          <button onClick={() => navigate('/labels', { state: { selectedIds: [box.id] } })}>Print label</button>
        </div>
      </section>
      <aside className="qr-panel">
        <QRCodeSVG value={`${publicAppUrl}/box/${box.box_number}`} size={220} level="H" includeMargin />
        <strong>{box.box_number}</strong>
      </aside>
    </div>
  );
}
