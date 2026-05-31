import { QRCodeSVG } from 'qrcode.react';
import { publicAppUrl } from '../lib/supabase';
import type { MoveBox } from '../types';

export function LabelSheet({ boxes }: { boxes: MoveBox[] }) {
  return (
    <div className="label-pages">
      {boxes.map((box, index) => {
        const url = `${publicAppUrl}/box/${box.box_number}`;
        return (
          <section className="print-label" key={box.id}>
            <div className="label-top">
              <strong>{box.box_number}</strong>
              <QRCodeSVG value={url} size={116} level="H" includeMargin />
            </div>
            <div className="route">{box.origin_room || 'Origin TBD'} to {box.destination_room || 'Destination TBD'}</div>
            <div className="label-meta">
              <span>{box.priority}</span>
              {box.fragile && <span>FRAGILE</span>}
              <span>{box.status}</span>
            </div>
            <p>{box.contents || box.title || 'No contents listed'}</p>
            {(index + 1) % 6 === 0 && <div className="page-break" />}
          </section>
        );
      })}
    </div>
  );
}
