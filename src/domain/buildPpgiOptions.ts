import type { SubjectSchedule } from '../types/turma.types';
import type { DisciplineOption } from './buildDisciplineOptions';

export interface PpgiSubject {
  id: string;
  name: string;
  shortName: string;
  credits: number;
}

export function buildPpgiOptions(subjects: PpgiSubject[], schedules: SubjectSchedule[]): DisciplineOption[] {
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const options: DisciplineOption[] = [];

  for (const schedule of schedules) {
    const subject = subjectById.get(schedule.subjectId);
    if (!subject) continue;

    schedule.turmas.forEach((turma, index) => {
      options.push({
        id: `${schedule.subjectId}-${turma.code}-${index}`,
        subjectId: schedule.subjectId,
        name: subject.name,
        shortName: subject.shortName,
        period: -1,
        hours: schedule.hours,
        credits: subject.credits,
        turmaCode: turma.code,
        teacher: turma.teacher,
        slots: turma.slots,
      });
    });
  }

  return options;
}