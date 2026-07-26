import type { Subject } from '../types/subject.types';
import type { SubjectSchedule } from '../types/turma.types';
import type { ElectiveOption } from '../types/electiveOption.types';

export interface DisciplineOption {
  id: string;
  subjectId: string;
  name: string;
  shortName: string;
  period: number;
  hours: number;
  credits: number;
  turmaCode: string;
  teacher: string;
  slots: { day: string; time: string }[];
  program?: 'mestrado' | 'doutorado';
  area?: string;
}

export function buildDisciplineOptions(
  subjects: Subject[],
  electives: ElectiveOption[],
  schedules: SubjectSchedule[],
): DisciplineOption[] {
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const electiveById = new Map(electives.map((elective) => [elective.id, elective]));
  const options: DisciplineOption[] = [];

  for (const schedule of schedules) {
    const subject = subjectById.get(schedule.subjectId);
    const elective = subject ? null : electiveById.get(schedule.subjectId);
    const source = subject ?? elective;
    if (!source) continue;

    schedule.turmas.forEach((turma, index) => {
      options.push({
        id: `${schedule.subjectId}-${turma.code}-${index}`,
        subjectId: schedule.subjectId,
        name: source.name,
        shortName: source.shortName,
        period: schedule.period,
        hours: schedule.hours,
        credits: source.credits,
        turmaCode: turma.code,
        teacher: turma.teacher,
        slots: turma.slots,
      });
    });
  }

  return options;
}