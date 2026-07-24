import type { Subject } from '../types/subject.types';
import type { SubjectSchedule } from '../types/turma.types';

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
}

export function buildDisciplineOptions(subjects: Subject[], schedules: SubjectSchedule[]): DisciplineOption[] {
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
        period: schedule.period,
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