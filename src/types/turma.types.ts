export interface TurmaSlot {
  day: 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX';
  time: string;
}

export interface Turma {
  code: string;
  teacher: string;
  slots: TurmaSlot[];
}

export interface SubjectSchedule {
  subjectId: string;
  period: number;
  hours: number;
  turmas: Turma[];
}