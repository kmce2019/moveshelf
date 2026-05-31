import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BoxForm } from '../components/BoxForm';
import { fetchBoxByNumber, updateBox } from '../lib/boxes';
import { boxPhotoUrl, uploadBoxPhoto } from '../lib/photos';
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
  photo_path: box.photo_path || null,
  photo_url: box.photo_url || null,
  label_printed: box.label_printed,
});

export function EditBox() {
  const { boxNumber = '' } = useParams();
  const [box, setBox] = useState<MoveBox | null>(null);
  const [value, setValue] = useState<BoxInput | null>(null);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoxByNumber(boxNumber).then((data) => {
      if (!data) setError('Box not found');
      else { setBox(data); setValue(toInput(data)); setPhotoPreview(boxPhotoUrl(data)); }
    }).catch((err) => setError(err.message));
  }, [boxNumber]);

  const choosePhoto = (file: File | null) => {
    setPhotoFile(file);
    setPhotoError('');
    if (file) setPhotoPreview(URL.createObjectURL(file));
    else if (box) setPhotoPreview(boxPhotoUrl(box));
  };

  const save = async (intent: 'save' | 'another' | 'print') => {
    if (!box || !value) return;
    let updated = await updateBox(box.id, value);
    if (photoFile) {
      try {
        const photo = await uploadBoxPhoto(updated.box_number, photoFile);
        updated = await updateBox(updated.id, photo);
      } catch (err) {
        setPhotoError(err instanceof Error ? err.message : 'Photo upload failed');
        return;
      }
    }
    if (intent === 'print') navigate('/labels', { state: { selectedIds: [updated.id] } });
    else navigate(`/box/${updated.box_number}`);
  };

  if (error) return <p className="notice error">{error}</p>;
  if (!value) return <p className="notice">Loading...</p>;
  return (
    <div className="stack">
      <h2>Edit {boxNumber}</h2>
      <BoxForm
        value={value}
        onChange={setValue}
        onSubmit={save}
        onPhotoChange={choosePhoto}
        photoPreview={photoPreview}
        photoError={photoError}
        submitLabel="Save"
      />
    </div>
  );
}
