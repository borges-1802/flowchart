import type { Subject } from '../types/subject.types';

interface SubjectDetailPanelProps {
  subject: Subject;
  nameById: Map<string, string>;
}

function resolveNames(ids: string[], nameById: Map<string, string>): string[] {
  return ids.map((id) => nameById.get(id) ?? id);
}

function parseDifficulty(difficultyLevel: string): { filled: number; total: number } | null {
  const match = difficultyLevel.match(/(\d)\s*\/\s*(\d)/);
  if (!match) return null;
  return { filled: Number(match[1]), total: Number(match[2]) };
}

export function SubjectDetailPanel({ subject, nameById }: SubjectDetailPanelProps) {
  const preRequisiteNames = resolveNames(subject.preRequisites, nameById);
  const difficulty = parseDifficulty(subject.difficultyLevel);

  const currentTeachers = subject.teachers
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const hasAnyTeacherInfo = currentTeachers.length > 0 || subject.teacherHistory.length > 0;

  return (
    <div
      className="mx-4 mb-4 rounded-2xl bg-neutral-900 p-5 text-white"
      onClick={(event) => event.stopPropagation()}
    >
      <h2 className="text-xl font-bold">{subject.name}</h2>
      <p className="mb-4 text-xs text-neutral-500">
        {subject.id} · {subject.credits} créditos
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          {subject.curriculum && (
            <>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Ementa</p>
              <p className="mb-4 text-sm leading-relaxed text-neutral-300">{subject.curriculum}</p>
            </>
          )}

          {subject.advice && (
            <blockquote className="mb-4 border-l-2 border-amber-500 bg-neutral-800/60 py-2 pl-3 text-sm italic text-neutral-300">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Dicas</p>
              <p>"{subject.advice}"</p>
            </blockquote>
          )}

          {preRequisiteNames.length > 0 && (
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Pré-requisitos</p>
              <div className="flex flex-wrap gap-1.5">
                {preRequisiteNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          {difficulty && (
            <div className="mb-4">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                Dificuldade
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: difficulty.total }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-3 w-3 rounded-full ${index < difficulty.filled ? 'bg-pink-500' : 'bg-neutral-700'}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Professores</p>
            {hasAnyTeacherInfo ? (
              <ul className="space-y-1.5 text-sm">
                {currentTeachers.map((name) => (
                  <li key={`current-${name}`} className="flex items-center justify-between gap-3">
                    <span className="font-medium text-neutral-200">{name}</span>
                    <span className="text-xs font-medium text-green-500">Atual</span>
                  </li>
                ))}
                {subject.teacherHistory.map((record, index) => (
                  <li key={`history-${index}`} className="flex items-center justify-between gap-3">
                    <span className="text-neutral-400">{record.name}</span>
                    <span className="text-xs text-neutral-500">{record.semester}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}