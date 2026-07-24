export type SubjectStatus = 'locked' | 'available' | 'completed' | 'highlighted-pre' | 'highlighted-post';

export interface TeacherRecord {
  name: string;
  semester: string;
}

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
  teacherHistory: TeacherRecord[];
  advice: string;
  availability: string;
  schedule: string;
}