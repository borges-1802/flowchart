import { X } from 'lucide-react';
import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getColorByIndex, NEUTRAL_DOT } from '../../domain/subjectColor';

interface DisciplineListItemProps {
  theme: 'dark' | 'light';
  option: DisciplineOption;
  isArmed: boolean;
  isPlaced: boolean;
  colorIndex: number | undefined;
  onClick: () => void;
  onRemove: () => void;
}

export function DisciplineListItem({
  theme,
  option,
  isArmed,
  isPlaced,
  colorIndex,
  onClick,
  onRemove,
}: DisciplineListItemProps) {
  const isDark = theme === 'dark';

  if (isPlaced) {
    const color = colorIndex !== undefined ? getColorByIndex(colorIndex) : null;
    const bgClass = color ? color.base : NEUTRAL_DOT;
    const textClass = color ? color.text : isDark ? 'text-white' : 'text-black';

    return (
      <div className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 ${bgClass} ${textClass}`}>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {option.subjectId} · {option.shortName}
          </span>
          <span className="block truncate text-xs opacity-80">{option.teacher}</span>
        </span>
        <span className="shrink-0 text-xs opacity-80">{option.hours}h</span>
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
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isArmed ? armedClass : hoverClass
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${NEUTRAL_DOT}`} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
          {option.subjectId} · {option.shortName}
        </span>
        <span className="block truncate text-xs text-neutral-500">{option.teacher}</span>
      </span>
      <span className="shrink-0 text-xs text-neutral-500">{option.hours}h</span>
    </button>
  );
}