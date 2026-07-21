import type { Subject, SubjectStatus } from '../../types/subject.types';

interface SubjectBoxProps {
  subject: Subject;
  status: SubjectStatus;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const statusColorClasses: Record<SubjectStatus, string> = {
  locked: 'bg-neutral-500',
  available: 'bg-red-400',
  completed: 'bg-green-500',
  'highlighted-pre': 'bg-blue-500',
  'highlighted-post': 'bg-purple-500',
};

export function SubjectBox({ subject, status, isSelected, onClick }: SubjectBoxProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick(subject.id);
      }}
      className={`flex h-[58px] w-full items-center justify-center rounded-[10px] px-2.5 text-center text-xs font-semibold leading-tight text-white transition-transform duration-200 active:scale-95 ${statusColorClasses[status]} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
    >
      {subject.name}
    </button>
  );
}