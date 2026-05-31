import type { BoxInput, MoveBox } from '../types';

const fields = [
  'id',
  'box_number',
  'title',
  'origin_room',
  'destination_room',
  'contents',
  'category',
  'priority',
  'fragile',
  'status',
  'current_location',
  'notes',
  'photo_path',
  'photo_url',
  'label_printed',
  'created_at',
  'updated_at',
] as const;

const escapeCsv = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export function boxesToCsv(boxes: MoveBox[]) {
  return [fields.join(','), ...boxes.map((box) => fields.map((field) => escapeCsv(box[field])).join(','))].join('\n');
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(current);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  row.push(current);
  if (row.some((cell) => cell.trim())) rows.push(row);

  const [headers = [], ...data] = rows;
  return data.map((cells) => Object.fromEntries(headers.map((header, index) => [header.trim(), cells[index] ?? ''])));
}

export function rowToBoxInput(row: Record<string, string>): BoxInput {
  return {
    box_number: row.box_number?.trim().toUpperCase(),
    title: row.title || '',
    origin_room: row.origin_room || '',
    destination_room: row.destination_room || '',
    contents: row.contents || '',
    category: row.category || '',
    priority: (row.priority as BoxInput['priority']) || 'Normal',
    fragile: ['true', 'yes', '1'].includes(String(row.fragile).toLowerCase()),
    status: (row.status as BoxInput['status']) || 'Planned',
    current_location: row.current_location || '',
    notes: row.notes || '',
    photo_path: row.photo_path || null,
    photo_url: row.photo_url || null,
    label_printed: ['true', 'yes', '1'].includes(String(row.label_printed).toLowerCase()),
  };
}
