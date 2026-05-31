import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxForm } from '../components/BoxForm';
import { createBox, fetchBoxes, nextBoxNumber, updateBox } from '../lib/boxes';
import { uploadBoxPhoto } from '../lib/photos';
import { emptyBoxInput, type BoxInput } from '../types';

export function AddBox() {
  const [value, setValue] = useState<BoxInput>(emptyBoxInput('BOX-001'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoxes().then((boxes) => setValue(emptyBoxInput(nextBoxNumber(boxes)))).catch((err) => setError(err.message));
  }, []);

  const choosePhoto = (file: File | null) => {
    setPhotoFile(file);
    setPhotoError('');
    if (!file) {
      setPhotoPreview('');
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  };

  const save = async (intent: 'save' | 'another' | 'print') => {
    setBusy(true);
    setError('');
    try {
      let box = await createBox(value);
      if (photoFile) {
        try {
          const photo = await uploadBoxPhoto(box.box_number, photoFile);
          box = await updateBox(box.id, photo);
        } catch (err) {
          setPhotoError(err instanceof Error ? err.message : 'Photo upload failed');
          return;
        }
      }
      if (intent === 'another') {
        const boxes = await fetchBoxes();
        setValue(emptyBoxInput(nextBoxNumber(boxes)));
        setPhotoFile(null);
        setPhotoPreview('');
      } else if (intent === 'print') {
        navigate('/labels', { state: { selectedIds: [box.id] } });
      } else {
        navigate(`/box/${box.box_number}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save box');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <h2>Add Box</h2>
      {error && <p className="notice error">{error}</p>}
      <BoxForm
        value={value}
        onChange={setValue}
        onSubmit={save}
        onPhotoChange={choosePhoto}
        photoPreview={photoPreview}
        photoError={photoError}
        busy={busy}
        submitLabel="Save"
      />
    </div>
  );
}
