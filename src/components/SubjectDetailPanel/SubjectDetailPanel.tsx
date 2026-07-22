import type { Subject } from '../../types/subject.types';

interface SubjectDetailPanelProps {
  subject: Subject;
  nameById: Map<string, string>;
}

function resolveNames(ids: string[], nameById: Map<string, string>): string[] {
  return ids.map((id) => nameById.get(id) ?? id);
}

export function SubjectDetailPanel({ subject, nameById }: SubjectDetailPanelProps) {
  const preRequisiteNames = resolveNames(subject.preRequisites, nameById);
  const postRequisiteNames = resolveNames(subject.postRequisites, nameById);

  return (
    <div
      className="mx-4 mb-4 rounded-xl bg-neutral-900 p-4 text-white"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">{subject.name}</h2>
        <span className="whitespace-nowrap text-xs text-neutral-500">{subject.id}</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
        <span>{subject.credits} créditos</span>
        {subject.difficultyLevel && <span>Dificuldade {subject.difficultyLevel}</span>}
        {subject.evaluationStyle && <span>Avaliação: {subject.evaluationStyle}</span>}
        {subject.teachers && <span>Professor(es): {subject.teachers}</span>}
        {subject.schedule && <span>{subject.schedule}</span>}
      </div>

      {subject.curriculum && <p className="mb-3 text-sm leading-relaxed text-neutral-300">{subject.curriculum}</p>}

      {subject.advice && (
        <p className="mb-3 rounded-lg bg-neutral-800 p-3 text-sm italic leading-relaxed text-neutral-300">
          {subject.advice}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="mb-1 font-semibold text-neutral-400">Pré-requisitos</p>
          {preRequisiteNames.length > 0 ? (
            <ul className="space-y-0.5 text-neutral-300">
              {preRequisiteNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">Nenhum</p>
          )}
        </div>

        <div>
          <p className="mb-1 font-semibold text-neutral-400">Disciplinas que ela prende</p>
          {postRequisiteNames.length > 0 ? (
            <ul className="space-y-0.5 text-neutral-300">
              {postRequisiteNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">Nenhuma</p>
          )}
        </div>
      </div>
    </div>
  );
}