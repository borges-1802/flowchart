export type SubjectStatus = 'locked' | 'available' | 'completed' | 'highlighted-pre' | 'highlighted-post';

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  period: number;
  preRequisites: string[];
  postRequisites: string[];
  credits: number;
  curriculum: string;
  difficultyLevel: string;
  evaluationStyle: string;
  teachers: string;
  advice: string;
  availability: string;
  schedule: string;
}