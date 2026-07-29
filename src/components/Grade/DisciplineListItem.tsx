import { X, Trash2 } from 'lucide-react';
import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getColorByIndex, NEUTRAL_DOT } from '../../domain/subjectColor';

interface DisciplineListItemProps {
  theme: 'dark' | 'light';
  option: DisciplineOption;
  isArmed: boolean;
  isPlaced: boolean;
  isCustom: boolean;
  colorIndex: number | undefined;
  onClick: () => void;
  onRemove: () => void;
  onDelete: () => void;
}

function formatSlots(slots: { day: string; time: string }[]): string {
  const dayGroupsByTime = new Map<string, string[]>();
  for (const slot of slots) {
    const days = dayGroupsByTime.get(slot.time) ?? [];
    days.push(slot.day);
    dayGroupsByTime.set(slot.time, days);
  }
  return [...dayGroupsByTime.entries()].map(([time, days]) => `${days.join('/')} ${time}`).join(', ');
}

export function DisciplineListItem({
  theme,
  option,
  isArmed,
  isPlaced,
  isCustom,
  colorIndex,
  onClick,
  onRemove,
  onDelete,
}: DisciplineListItemProps) {
  const isDark = theme === 'dark';
  const schedule = formatSlots(option.slots);

  if (isPlaced) {
    const color = colorIndex !== undefined ? getColorByIndex(colorIndex) : null;
    const bgClass = color ? color.base : NEUTRAL_DOT;
    const textClass = color ? color.text : isDark ? 'text-white' : 'text-black';

    return (
      <div className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 ${bgClass} ${textClass}`}>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {isCustom ? option.shortName : `${option.subjectId} · ${option.shortName}`}
          </span>
          <span className="block truncate text-xs opacity-80">{option.teacher}</span>
          <span className="block truncate text-[11px] opacity-70">{schedule}</span>
        </span>
        <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">
          {option.area || `${option.hours}h`}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${option.shortName} da grade`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-black/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const armedClass = isDark ? 'bg-white/10 ring-1 ring-white/30' : 'bg-black/5 ring-1 ring-black/20';
  const hoverClass = isDark ? 'hover:bg-white/5' : 'hover:bg-black/5';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onClick();
      }}
      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isArmed ? armedClass : hoverClass
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${NEUTRAL_DOT}`} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
          {isCustom ? option.shortName : `${option.subjectId} · ${option.shortName}`}
        </span>
        <span className="block truncate text-xs text-neutral-500">{option.teacher}</span>
        <span className="block truncate text-[11px] text-neutral-500">{schedule}</span>
      </span>
      <span
        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
          option.area ? (isDark ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-200 text-neutral-600') : 'text-neutral-500'
        }`}
      >
        {option.area || `${option.hours}h`}
      </span>
      {isCustom && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          aria-label={`Excluir ${option.shortName}`}
          title="Excluir esta eletiva livre"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            isDark ? 'text-neutral-500 hover:bg-red-500/20 hover:text-red-400' : 'text-neutral-400 hover:bg-red-100 hover:text-red-600'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}