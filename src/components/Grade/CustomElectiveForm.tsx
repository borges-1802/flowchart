import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DAYS, TIME_BLOCKS } from '../../domain/scheduleGrid';
import { clampCredits, getNextTimeBlock, type CustomElective } from '../../domain/customElectives';

interface CustomElectiveFormProps {
  theme: 'dark' | 'light';
  onCreate: (elective: CustomElective) => void;
}

export function CustomElectiveForm({ theme, onCreate }: CustomElectiveFormProps) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('4');
  const [day, setDay] = useState<string>(DAYS[0]);
  const [time, setTime] = useState<string>(TIME_BLOCKS[0]);
  const [duration, setDuration] = useState<2 | 4>(2);

  const inputClass = isDark
    ? 'border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500'
    : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';

  const nextBlock = getNextTimeBlock(time);

  function handleCreate() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onCreate({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: trimmedName,
      credits: clampCredits(Number(credits)),
      day,
      time,
      duration: duration === 4 && nextBlock ? 4 : 2,
    });

    setName('');
    setCredits('4');
    setDuration(2);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`mb-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-xs font-medium ${
          isDark
            ? 'border-neutral-700 text-neutral-400 hover:bg-white/5'
            : 'border-neutral-300 text-neutral-500 hover:bg-black/5'
        }`}
      >
        <Plus className="h-3.5 w-3.5" />
        Nova eletiva livre
      </button>
    );
  }

  return (
    <div className={`mb-3 flex flex-col gap-2 rounded-lg border p-3 ${isDark ? 'border-neutral-700' : 'border-neutral-300'}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Nova eletiva livre</p>

      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nome da disciplina"
        className={`min-w-0 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
      />

      <div className="flex gap-2">
        <select
          value={day}
          onChange={(event) => setDay(event.target.value)}
          className={`min-w-0 flex-1 rounded-lg border px-2 py-2 text-sm ${inputClass}`}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className={`min-w-0 flex-1 rounded-lg border px-2 py-2 text-sm ${inputClass}`}
        >
          {TIME_BLOCKS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <select
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value) as 2 | 4)}
          className={`min-w-0 flex-1 rounded-lg border px-2 py-2 text-sm ${inputClass}`}
        >
          <option value={2}>2h</option>
          <option value={4} disabled={!nextBlock}>
            4h (2 blocos seguidos)
          </option>
        </select>
        <input
          type="number"
          min="1"
          max="32"
          step="1"
          value={credits}
          onChange={(event) => setCredits(event.target.value)}
          placeholder="Créditos"
          className={`min-w-0 w-20 rounded-lg border px-2 py-2 text-sm ${inputClass}`}
        />
      </div>

      {duration === 4 && nextBlock && (
        <p className={`text-[10px] ${labelClass}`}>
          Ocupa {time} e {nextBlock} em {day}.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCreate}
          className="min-w-0 flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
        >
          Criar
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={`min-w-0 shrink-0 rounded-lg px-4 py-2 text-sm font-medium ${
            isDark ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
          }`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}