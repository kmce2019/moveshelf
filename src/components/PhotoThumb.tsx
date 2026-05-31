import { boxPhotoUrl } from '../lib/photos';
import type { MoveBox } from '../types';

export function PhotoThumb({ box, label = 'Box photo' }: { box: Pick<MoveBox, 'photo_path' | 'photo_url'>; label?: string }) {
  const url = boxPhotoUrl(box);
  if (!url) return <span className="thumb-placeholder">No photo</span>;
  return <img className="thumb" src={url} alt={label} loading="lazy" />;
}
