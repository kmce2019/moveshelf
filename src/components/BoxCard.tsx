import { Link } from 'react-router-dom';
import type { MoveBox } from '../types';

export function BoxCard({ box }: { box: MoveBox }) {
  return (
    <article className="box-card">
      <div>
        <Link className="box-number" to={`/box/${box.box_number}`}>{box.box_number}</Link>
        <h3>{box.title || box.contents?.slice(0, 70) || 'Untitled box'}</h3>
      </div>
      <p>{box.origin_room || 'Origin TBD'} to {box.destination_room || 'Destination TBD'}</p>
      <p className="muted">{box.contents || 'No contents listed'}</p>
      <div className="chip-row">
        <span className="chip">{box.status}</span>
        <span className="chip priority">{box.priority}</span>
        {box.fragile && <span className="chip danger">Fragile</span>}
      </div>
    </article>
  );
}
