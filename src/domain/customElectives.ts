import { TIME_BLOCKS } from './scheduleGrid';
import type { DisciplineOption } from './buildDisciplineOptions';

export interface CustomElective {
  id: string;
  name: string;
  credits: number;
  day: string;
  time: string;
  duration: 2 | 4;
}

export const FREE_PERIOD = -2;

export function clampCredits(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(32, Math.max(1, Math.round(value)));
}

export function isCustomOptionId(id: string): boolean {
  return id.startsWith('custom-');
}

export function getNextTimeBlock(time: string): string | null {
  const index = TIME_BLOCKS.indexOf(time as (typeof TIME_BLOCKS)[number]);
  if (index === -1 || index === TIME_BLOCKS.length - 1) return null;
  return TIME_BLOCKS[index + 1];
}

function slotsFor(day: string, time: string, duration: 2 | 4): { day: string; time: string }[] {
  if (duration === 2) return [{ day, time }];
  const next = getNextTimeBlock(time);
  if (!next) return [{ day, time }];
  return [
    { day, time },
    { day, time: next },
  ];
}

export function buildCustomOptions(customElectives: CustomElective[]): DisciplineOption[] {
  return customElectives.map((elective) => ({
    id: elective.id,
    subjectId: elective.id,
    name: elective.name,
    shortName: elective.name,
    period: FREE_PERIOD,
    hours: elective.duration,
    credits: elective.credits,
    turmaCode: 'T1',
    teacher: 'Livre',
    slots: slotsFor(elective.day, elective.time, elective.duration),
  }));
}