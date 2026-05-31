import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BoxForm } from '../components/BoxForm';
import { fetchBoxByNumber, updateBox } from '../lib/boxes';
import type { BoxInput, MoveBox } from '../types';

const toInput = (box: MoveBox): BoxInput => ({
  box_number: box.box_number,
  title: box.title || '',
  origin_room: box.origin_room || '',
  destination_room: box.destination_room || '',
  contents: box.contents || '',
  category: box.category || '',
  priority: box.priority,
  fragile: box.fragile,
  status: box.status,
  current_location: box.current_location || '',
  notes: box.notes || '',
  label_printed: box.label_printed,
});

export function EditBox() {
  const { boxNumber = '' } = useParams();
  const [box, setBox] = useState<MoveBox | null>(null);
  const [value, setValue] = useState<BoxInput | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoxByNumber(boxNumber).then((data) => {
      if (!data) setError('Box not found');
      else { setBox(data); setValue(toInput(data)); }
    }).catch((err) => setError(err.message));
  }, [boxNumber]);

  const save = async (intent: 'save' | 'another' | 'print') => {
    if (!box || !value) return;
    const updated = await updateBox(box.id, value);
    if (intent === 'print') navigate('/labels', { state: { selectedIds: [updated.id] } });
    else navigate(`/box/${updated.box_number}`);
  };

  if (error) return <p className="notice error">{error}</p>;
  if (!value) return <p className="notice">Loading...</p>;
  return <div className="stack"><h2>Edit {boxNumber}</h2><BoxForm value={value} onChange={setValue} onSubmit={save} submitLabel="Save" /></div>;
}
