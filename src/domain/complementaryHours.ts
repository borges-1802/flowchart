export interface ComplementaryActivity {
  id: string;
  label: string;
  unit: string;
  rate: number;
  min: number;
  max: number;
  doc: string;
}

export interface ComplementaryEntry {
  id: string;
  activityId: string;
  units: number;
  description: string;
  hours: number;
}

export const GOAL_HOURS = 90;

const SINGULAR: Record<string, string> = {
  meses: 'mês',
  eventos: 'evento',
  apresentações: 'apresentação',
  etapas: 'etapa',
  premiações: 'premiação',
  dias: 'dia',
  semestres: 'semestre',
  horas: 'hora',
};

export function singularUnit(unit: string): string {
  return SINGULAR[unit] ?? unit;
}

export function computeHours(activity: ComplementaryActivity, units: number): number {
  return Math.round(units * activity.rate * 100) / 100;
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function computeRawHours(entries: ComplementaryEntry[], activityId: string): number {
  return entries.filter((entry) => entry.activityId === activityId).reduce((sum, entry) => sum + entry.hours, 0);
}

export function computeCategoryHours(entries: ComplementaryEntry[], activityId: string, activities: ComplementaryActivity[]): number {
  const activity = activities.find((a) => a.id === activityId);
  if (!activity) return 0;
  return Math.min(computeRawHours(entries, activityId), activity.max);
}

export function computeTotalHours(entries: ComplementaryEntry[], activities: ComplementaryActivity[]): number {
  const total = activities.reduce((sum, activity) => sum + computeCategoryHours(entries, activity.id, activities), 0);
  return round1(total);
}