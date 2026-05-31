import type { FormEvent } from 'react';
import { priorities, statuses, type BoxInput } from '../types';

type Props = {
  value: BoxInput;
  busy?: boolean;
  submitLabel: string;
  onChange: (value: BoxInput) => void;
  onSubmit: (intent: 'save' | 'another' | 'print') => void;
};

export function BoxForm({ value, busy, submitLabel, onChange, onSubmit }: Props) {
  const update = <K extends keyof BoxInput>(key: K, next: BoxInput[K]) => onChange({ ...value, [key]: next });
  const submit = (event: FormEvent, intent: 'save' | 'another' | 'print') => {
    event.preventDefault();
    onSubmit(intent);
  };

  return (
    <form className="box-form">
      <div className="field">
        <label htmlFor="box_number">Box number</label>
        <input id="box_number" value={value.box_number} onChange={(event) => update('box_number', event.target.value.toUpperCase())} required />
      </div>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" value={value.title || ''} onChange={(event) => update('title', event.target.value)} placeholder="Kitchen pans, desk cables..." />
      </div>
      <div className="field">
        <label htmlFor="origin_room">Origin room</label>
        <input id="origin_room" value={value.origin_room || ''} onChange={(event) => update('origin_room', event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="destination_room">Destination room</label>
        <input id="destination_room" value={value.destination_room || ''} onChange={(event) => update('destination_room', event.target.value)} />
      </div>
      <div className="field span-2">
        <label htmlFor="contents">Contents</label>
        <textarea id="contents" rows={5} value={value.contents || ''} onChange={(event) => update('contents', event.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <input id="category" value={value.category || ''} onChange={(event) => update('category', event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="priority">Priority</label>
        <select id="priority" value={value.priority} onChange={(event) => update('priority', event.target.value as BoxInput['priority'])}>
          {priorities.map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" value={value.status} onChange={(event) => update('status', event.target.value as BoxInput['status'])}>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="current_location">Current location</label>
        <input id="current_location" value={value.current_location || ''} onChange={(event) => update('current_location', event.target.value)} />
      </div>
      <label className="check-field">
        <input type="checkbox" checked={value.fragile} onChange={(event) => update('fragile', event.target.checked)} />
        Fragile
      </label>
      <div className="field span-2">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" rows={3} value={value.notes || ''} onChange={(event) => update('notes', event.target.value)} />
      </div>
      <div className="button-row span-2">
        <button disabled={busy} onClick={(event) => submit(event, 'save')}>{submitLabel}</button>
        <button className="secondary" disabled={busy} onClick={(event) => submit(event, 'another')}>Save & Add Another</button>
        <button className="secondary" disabled={busy} onClick={(event) => submit(event, 'print')}>Save & Print Label</button>
      </div>
    </form>
  );
}
