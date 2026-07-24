import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getSubjectColor } from '../../domain/subjectColor';

interface DisciplineListItemProps {
  theme: 'dark' | 'light';
  option: DisciplineOption;
  isSelected: boolean;
  onClick: () => void;
}

export function DisciplineListItem({ theme, option, isSelected, onClick }: DisciplineListItemProps) {
  const isDark = theme === 'dark';
  const color = getSubjectColor(option.subjectId);

  const selectedClass = isDark ? 'bg-white/10 ring-1 ring-white/30' : 'bg-black/5 ring-1 ring-black/20';
  const hoverClass = isDark ? 'hover:bg-white/5' : 'hover:bg-black/5';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isSelected ? selectedClass : hoverClass
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${color.dot}`} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
          {option.subjectId} · {option.shortName}
        </span>
        <span className={`block truncate text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          {option.teacher}
        </span>
      </span>
      <span className={`shrink-0 text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{option.hours}h</span>
    </button>
  );
}