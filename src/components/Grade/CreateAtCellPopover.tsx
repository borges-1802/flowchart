import { useState } from 'react';
import { clampCredits, getNextTimeBlock } from '../../domain/customElectives';

interface CreateAtCellPopoverProps {
  theme: 'dark' | 'light';
  day: string;
  time: string;
  onCreate: (name: string, credits: number, duration: 2 | 4) => void;
  onCancel: () => void;
}

export function CreateAtCellPopover({ theme, day, time, onCreate, onCancel }: CreateAtCellPopoverProps) {
  const isDark = theme === 'dark';
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('4');
  const [duration, setDuration] = useState<2 | 4>(2);

  const inputClass = isDark
    ? 'border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500'
    : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const nextBlock = getNextTimeBlock(time);

  function handleSubmit() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName, clampCredits(Number(credits)), duration === 4 && nextBlock ? 4 : 2);
  }

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={`absolute left-1/2 top-full z-50 mt-1 w-48 -translate-x-1/2 rounded-lg border p-2.5 shadow-xl sm:w-56 sm:p-3 ${
        isDark ? 'border-neutral-700 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-900'
      }`}
    >
      <p className={`mb-2 text-[10px] font-medium ${labelClass}`}>
        Nova eletiva livre · {day} {time}
      </p>

      <input
        type="text"
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSubmit();
          if (event.key === 'Escape') onCancel();
        }}
        placeholder="Nome da disciplina"
        className={`mb-2 min-w-0 w-full rounded-lg border px-2.5 py-1.5 text-xs ${inputClass}`}
      />

      <div className="mb-2 flex items-center gap-2">
        <select
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value) as 2 | 4)}
          className={`min-w-0 flex-1 rounded-lg border px-2 py-1 text-xs ${inputClass}`}
        >
          <option value={2}>2h</option>
          <option value={4} disabled={!nextBlock}>
            4h
          </option>
        </select>
        <input
          type="number"
          min="1"
          max="32"
          step="1"
          value={credits}
          onChange={(event) => setCredits(event.target.value)}
          className={`min-w-0 w-14 rounded-lg border px-2 py-1 text-xs ${inputClass}`}
        />
      </div>

      {duration === 4 && nextBlock && <p className={`mb-2 text-[10px] ${labelClass}`}>Ocupa {time} e {nextBlock}.</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="min-w-0 flex-1 rounded-lg bg-green-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
        >
          Criar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`min-w-0 shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium ${
            isDark ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
          }`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}