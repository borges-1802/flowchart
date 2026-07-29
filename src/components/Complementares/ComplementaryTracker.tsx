import { useState } from 'react';
import { X } from 'lucide-react';
import type { ComplementaryActivity, ComplementaryEntry } from '../../domain/complementaryHours';
import { computeHours, computeRawHours, round1, singularUnit } from '../../domain/complementaryHours';

interface ComplementaryTrackerProps {
  theme: 'dark' | 'light';
  activities: ComplementaryActivity[];
  entries: ComplementaryEntry[];
  onAdd: (entry: ComplementaryEntry) => void;
  onRemove: (id: string) => void;
}

export function ComplementaryTracker({ theme, activities, entries, onAdd, onRemove }: ComplementaryTrackerProps) {
  const isDark = theme === 'dark';
  const [typeId, setTypeId] = useState(activities[0]?.id ?? '');
  const [units, setUnits] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const inputClass = isDark
    ? 'border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500'
    : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const cardInnerClass = isDark ? 'bg-neutral-800' : 'bg-neutral-100';
  const dividerClass = isDark ? 'border-neutral-800' : 'border-neutral-200';

  const activity = activities.find((a) => a.id === typeId) ?? activities[0];
  const parsedUnits = parseFloat(units);

  function handleAdd() {
    if (!activity) return;
    if (!parsedUnits || parsedUnits <= 0) {
      setError('Informe a quantidade/duração.');
      return;
    }
    if (parsedUnits < activity.min) {
      setError(`Duração mínima: ${activity.min} ${activity.unit}.`);
      return;
    }

    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      activityId: activity.id,
      units: parsedUnits,
      description: description.trim(),
      hours: computeHours(activity, parsedUnits),
    });
    setUnits('');
    setDescription('');
    setError(null);
  }

  // Progresso + prévia da categoria selecionada
  const usedRaw = activity ? computeRawHours(entries, activity.id) : 0;
  const used = activity ? Math.min(usedRaw, activity.max) : 0;
  const previewHoursRaw = activity && parsedUnits > 0 ? computeHours(activity, parsedUnits) : 0;
  const allowedHours = activity ? Math.max(0, Math.min(previewHoursRaw, activity.max - used)) : 0;
  const exceeds = previewHoursRaw > allowedHours + 0.01;
  const usedPct = activity ? (used / activity.max) * 100 : 0;
  const previewPct = activity ? (allowedHours / activity.max) * 100 : 0;

  const groupedEntries = activities
    .map((type) => {
      const items = entries.filter((entry) => entry.activityId === type.id);
      if (items.length === 0) return null;
      const rawSum = items.reduce((sum, entry) => sum + entry.hours, 0);
      return {
        activity: type,
        total: round1(Math.min(rawSum, type.max)),
        capped: rawSum > type.max,
        items,
      };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="relative mb-3 flex items-center gap-1.5">
          <p className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}>Lançar atividade</p>
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
              isDark ? 'border-neutral-500 text-neutral-500' : 'border-neutral-400 text-neutral-500'
            }`}
          >
            ?
          </button>
          {showHelp && (
            <div
              className={`absolute left-0 top-6 z-20 w-72 rounded-lg border p-3 text-[11px] leading-relaxed shadow-lg ${
                isDark ? 'border-neutral-700 bg-neutral-800 text-neutral-300' : 'border-neutral-300 bg-white text-neutral-700'
              }`}
            >
              <b className={isDark ? 'text-white' : 'text-neutral-900'}>Como calculamos:</b> cada tipo de atividade tem
              uma taxa fixa (ex: 9h por mês) e um teto máximo de horas. Preencha a duração/quantidade que a norma pede,
              e nós convertemos automaticamente — sempre respeitando o teto da categoria.
            </div>
          )}
        </div>

        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <select
            value={typeId}
            onChange={(event) => {
              setTypeId(event.target.value);
              setError(null);
            }}
            className={`min-w-0 rounded-lg border px-3 py-2 text-sm sm:flex-[1.6] ${inputClass}`}
          >
            {activities.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.5"
            value={units}
            onChange={(event) => setUnits(event.target.value)}
            placeholder={activity ? `Qtd. de ${activity.unit}` : 'Quantidade'}
            className={`min-w-0 rounded-lg border px-3 py-2 text-sm sm:flex-1 ${inputClass}`}
          />
        </div>

        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descrição (opcional, ex: nome do evento)"
          className={`mb-3 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
        />

        <div className="flex items-center justify-between gap-3">
          <p className={`text-[11px] leading-tight ${labelClass}`}>
            {activity &&
              `${activity.rate}${activity.id === 'curso_aperf' ? ' (×0.5)' : 'h'} por ${singularUnit(activity.unit)} · mín. ${activity.min} · máx. ${activity.max}h`}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
          >
            Adicionar
          </button>
        </div>

        {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}

        {activity && (
          <div className={`mt-3 border-t pt-3 ${dividerClass}`}>
            <div className="mb-1 flex justify-between text-xs">
              <span className={labelClass}>{activity.label}</span>
              <span>
                {round1(used)}h / {activity.max}h
              </span>
            </div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-neutral-700/40">
              <div
                className={`h-full ${used >= activity.max ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${usedPct}%` }}
              />
              <div className="h-full bg-blue-500" style={{ width: `${previewPct}%` }} />
            </div>
            {previewHoursRaw > 0 && (
              <p className={`mt-1.5 text-[11px] ${labelClass}`}>
                Isso somaria <span className="font-bold text-blue-500">+{round1(previewHoursRaw)}h</span>
                {exceeds && (
                  <>
                    {' '}
                    — mas só <span className="font-bold text-blue-500">{round1(allowedHours)}h</span> entram (excede o
                    teto)
                  </>
                )}
                .
              </p>
            )}
          </div>
        )}
      </div>

      {groupedEntries.length > 0 && (
        <div className={`border-t pt-4 ${dividerClass}`}>
          <div className="flex flex-col gap-4">
            {groupedEntries.map((group) => (
              <div key={group.activity.id}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <p className="text-sm font-bold">{group.activity.label}</p>
                  <p className={`text-xs ${labelClass}`}>
                    {group.total}h{group.capped && <span className="text-red-500"> (limite {group.activity.max}h)</span>}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {group.items.map((entry) => (
                    <div key={entry.id} className={`flex items-center justify-between rounded-lg px-3 py-2 ${cardInnerClass}`}>
                      <span className="text-xs">
                        {entry.units} {entry.activityId === group.activity.id ? group.activity.unit : ''}
                        {entry.description && ` — ${entry.description}`}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs ${labelClass}`}>{round1(entry.hours)}h</span>
                        <button
                          type="button"
                          onClick={() => onRemove(entry.id)}
                          aria-label="Remover"
                          className={labelClass}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}