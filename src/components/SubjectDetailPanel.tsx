import type { Subject } from '../types/subject.types';

interface SubjectDetailPanelProps {
  theme: 'dark' | 'light';
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

export function SubjectDetailPanel({ theme, subject, nameById }: SubjectDetailPanelProps) {
  const isDark = theme === 'dark';
  const preRequisiteNames = resolveNames(subject.preRequisites, nameById);
  const difficulty = parseDifficulty(subject.difficultyLevel);

  const currentTeachers = subject.teachers
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const hasAnyTeacherInfo = currentTeachers.length > 0 || subject.teacherHistory.length > 0;

  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const bodyTextClass = isDark ? 'text-neutral-300' : 'text-neutral-700';

  return (
    <div
      className={`mx-4 mb-4 rounded-2xl p-5 ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900'}`}
      onClick={(event) => event.stopPropagation()}
    >
      <h2 className="text-xl font-bold">{subject.name}</h2>
      <p className={`mb-4 text-xs ${labelClass}`}>
        {subject.id} · {subject.credits} créditos
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          {subject.curriculum && (
            <>
              <p className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Ementa</p>
              <p className={`mb-4 text-sm leading-relaxed ${bodyTextClass}`}>{subject.curriculum}</p>
            </>
          )}

          {subject.advice && (
            <blockquote
              className={`mb-4 border-l-2 border-amber-500 py-2 pl-3 text-sm italic ${bodyTextClass} ${
                isDark ? 'bg-neutral-800/60' : 'bg-white'
              }`}
            >
              <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Dicas</p>
              <p>"{subject.advice}"</p>
            </blockquote>
          )}

          {preRequisiteNames.length > 0 && (
            <div>
              <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Pré-requisitos</p>
              <div className="flex flex-wrap gap-1.5">
                {preRequisiteNames.map((name) => (
                  <span
                    key={name}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isDark ? 'bg-blue-500/65 text-white' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={`border-t pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 ${
            isDark ? 'border-neutral-800' : 'border-neutral-300'
          }`}
        >
          <div className="mb-4 flex gap-6">
            {subject.availability && (
              <div>
                <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Briga por vaga</p>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                    subject.availability === 'Alta'
                      ? 'bg-red-500/20 text-red-400'
                      : subject.availability === 'Média'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {subject.availability}
                </span>
              </div>
            )}

            {difficulty && (
              <div>
                <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Dificuldade</p>
                <div className="flex gap-1.5">
                  {Array.from({ length: difficulty.total }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-3 w-3 rounded-full ${
                        index < difficulty.filled ? 'bg-pink-500' : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>Professores</p>
            {hasAnyTeacherInfo ? (
              <ul className="space-y-1.5 text-sm">
                {currentTeachers.map((name) => (
                  <li key={`current-${name}`} className="flex items-center justify-between gap-3">
                    <span className={`font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{name}</span>
                    <span className="text-xs font-medium text-green-500">Atual</span>
                  </li>
                ))}
                {subject.teacherHistory.map((record, index) => (
                  <li key={`history-${index}`} className="flex items-center justify-between gap-3">
                    <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>{record.name}</span>
                    <span className={`text-xs ${labelClass}`}>{record.semester}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-sm ${labelClass}`}>—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}