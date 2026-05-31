import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxForm } from '../components/BoxForm';
import { createBox, fetchBoxes, nextBoxNumber } from '../lib/boxes';
import { emptyBoxInput, type BoxInput } from '../types';

export function AddBox() {
  const [value, setValue] = useState<BoxInput>(emptyBoxInput('BOX-001'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoxes().then((boxes) => setValue(emptyBoxInput(nextBoxNumber(boxes)))).catch((err) => setError(err.message));
  }, []);

  const save = async (intent: 'save' | 'another' | 'print') => {
    setBusy(true);
    setError('');
    try {
      const box = await createBox(value);
      if (intent === 'another') {
        const boxes = await fetchBoxes();
        setValue(emptyBoxInput(nextBoxNumber(boxes)));
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

  return <div className="stack"><h2>Add Box</h2>{error && <p className="notice error">{error}</p>}<BoxForm value={value} onChange={setValue} onSubmit={save} busy={busy} submitLabel="Save" /></div>;
}
