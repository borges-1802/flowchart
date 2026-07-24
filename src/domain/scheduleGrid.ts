import type { DisciplineOption } from './buildDisciplineOptions';

export const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'] as const;
export const TIME_BLOCKS = ['08-10h', '10-12h', '13-15h', '15-17h'] as const;

export function getOptionAt(
  day: string,
  time: string,
  placedIds: Set<string>,
  options: DisciplineOption[],
): DisciplineOption | null {
  for (const option of options) {
    if (!placedIds.has(option.id)) continue;
    const hasSlot = option.slots.some((slot) => slot.day === day && slot.time === time);
    if (hasSlot) return option;
  }
  return null;
}

export function hasConflict(option: DisciplineOption, placedIds: Set<string>, options: DisciplineOption[]): boolean {
  return option.slots.some((slot) => getOptionAt(slot.day, slot.time, placedIds, options) !== null);
}