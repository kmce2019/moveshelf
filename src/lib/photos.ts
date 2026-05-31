import { supabase } from './supabase';
import type { MoveBox } from '../types';

const PHOTO_BUCKET = 'box-photos';

function safeFilename(name: string) {
  const parts = name.toLowerCase().split('.');
  const extension = parts.length > 1 ? `.${parts.pop()}` : '';
  const base = parts.join('.').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
  return `${base}${extension}`;
}

export function boxPhotoUrl(box: Pick<MoveBox, 'photo_path' | 'photo_url'>) {
  if (box.photo_url) return box.photo_url;
  if (!box.photo_path) return '';
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(box.photo_path).data.publicUrl;
}

export async function uploadBoxPhoto(boxNumber: string, file: File) {
  const path = `${boxNumber}/${Date.now()}-${safeFilename(file.name)}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { upsert: true });
  if (error) throw new Error(`Photo upload failed: ${error.message}`);
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return { photo_path: path, photo_url: data.publicUrl };
}
