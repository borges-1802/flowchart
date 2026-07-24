import type { DisciplineOption } from '../../domain/buildDisciplineOptions';
import { getSubjectColor } from '../../domain/subjectColor';

interface DisciplineListItemProps {
  option: DisciplineOption;
  isSelected: boolean;
  onClick: () => void;
}

export function DisciplineListItem({ option, isSelected, onClick }: DisciplineListItemProps) {
  const color = getSubjectColor(option.subjectId);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isSelected ? 'bg-white/10 ring-1 ring-white/30' : 'hover:bg-white/5'
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${color.dot}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-100">
          {option.subjectId} · {option.shortName}
        </span>
        <span className="block truncate text-xs text-neutral-500">{option.teacher}</span>
      </span>
      <span className="shrink-0 text-xs text-neutral-500">{option.hours}h</span>
    </button>
  );
}