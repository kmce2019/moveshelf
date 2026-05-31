export type BoxStatus = 'Planned' | 'Packed' | 'Loaded' | 'Delivered' | 'Unpacked' | 'Missing';
export type BoxPriority = 'Low' | 'Normal' | 'Important' | 'Open First' | 'Critical';

export type MoveBox = {
  id: string;
  box_number: string;
  title: string | null;
  origin_room: string | null;
  destination_room: string | null;
  contents: string | null;
  category: string | null;
  priority: BoxPriority;
  fragile: boolean;
  status: BoxStatus;
  current_location: string | null;
  notes: string | null;
  photo_path: string | null;
  photo_url: string | null;
  label_printed: boolean;
  created_at: string;
  updated_at: string;
};

export type BoxInput = Omit<MoveBox, 'id' | 'created_at' | 'updated_at'>;

export const statuses: BoxStatus[] = ['Planned', 'Packed', 'Loaded', 'Delivered', 'Unpacked', 'Missing'];
export const priorities: BoxPriority[] = ['Low', 'Normal', 'Important', 'Open First', 'Critical'];

export const emptyBoxInput = (boxNumber: string): BoxInput => ({
  box_number: boxNumber,
  title: '',
  origin_room: '',
  destination_room: '',
  contents: '',
  category: '',
  priority: 'Normal',
  fragile: false,
  status: 'Planned',
  current_location: '',
  notes: '',
  photo_path: null,
  photo_url: null,
  label_printed: false,
});
