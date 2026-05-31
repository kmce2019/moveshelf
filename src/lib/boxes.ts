import { supabase } from './supabase';
import type { BoxInput, BoxStatus, MoveBox } from '../types';

const clean = (box: BoxInput) => ({
  ...box,
  box_number: box.box_number.trim().toUpperCase(),
  title: box.title?.trim() || null,
  origin_room: box.origin_room?.trim() || null,
  destination_room: box.destination_room?.trim() || null,
  contents: box.contents?.trim() || null,
  category: box.category?.trim() || null,
  current_location: box.current_location?.trim() || null,
  notes: box.notes?.trim() || null,
  photo_path: box.photo_path?.trim() || null,
  photo_url: box.photo_url?.trim() || null,
});

const cleanPartial = (box: Partial<BoxInput>) => ({
  ...box,
  ...(box.box_number !== undefined ? { box_number: box.box_number.trim().toUpperCase() } : {}),
  ...(box.title !== undefined ? { title: box.title?.trim() || null } : {}),
  ...(box.origin_room !== undefined ? { origin_room: box.origin_room?.trim() || null } : {}),
  ...(box.destination_room !== undefined ? { destination_room: box.destination_room?.trim() || null } : {}),
  ...(box.contents !== undefined ? { contents: box.contents?.trim() || null } : {}),
  ...(box.category !== undefined ? { category: box.category?.trim() || null } : {}),
  ...(box.current_location !== undefined ? { current_location: box.current_location?.trim() || null } : {}),
  ...(box.notes !== undefined ? { notes: box.notes?.trim() || null } : {}),
  ...(box.photo_path !== undefined ? { photo_path: box.photo_path?.trim() || null } : {}),
  ...(box.photo_url !== undefined ? { photo_url: box.photo_url?.trim() || null } : {}),
});

export async function fetchBoxes() {
  const { data, error } = await supabase.from('boxes').select('*').order('box_number', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchRecentBoxes(limit = 8) {
  const { data, error } = await supabase.from('boxes').select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data || [];
}

export async function fetchBoxByNumber(boxNumber: string) {
  const { data, error } = await supabase.from('boxes').select('*').eq('box_number', boxNumber.toUpperCase()).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createBox(input: BoxInput) {
  const { data, error } = await supabase.from('boxes').insert(clean(input)).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateBox(id: string, input: Partial<BoxInput>) {
  const { data, error } = await supabase.from('boxes').update({ ...cleanPartial(input), updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateBoxStatus(id: string, status: BoxStatus) {
  const { error } = await supabase.from('boxes').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function markLabelsPrinted(ids: string[]) {
  if (!ids.length) return;
  const { error } = await supabase.from('boxes').update({ label_printed: true, updated_at: new Date().toISOString() }).in('id', ids);
  if (error) throw error;
}

export function nextBoxNumber(boxes: Pick<MoveBox, 'box_number'>[]) {
  const max = boxes.reduce((highest, box) => {
    const match = /^BOX-(\d+)$/i.exec(box.box_number);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `BOX-${String(max + 1).padStart(3, '0')}`;
}

export function filterBoxes(boxes: MoveBox[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return boxes;
  return boxes.filter((box) =>
    [box.box_number, box.title, box.contents, box.origin_room, box.destination_room, box.status, box.priority, box.category, box.current_location, box.notes]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q)),
  );
}
