import type { Subject } from '../types/subject.types';
import type { ElectiveOption } from '../types/electiveOption.types';

interface HumanitiesOption {
  id: string;
  name: string;
  shortName: string;
  credits: number;
}

export function findSubjectLike(
  id: string,
  subjects: Subject[],
  electives: ElectiveOption[],
  humanities: HumanitiesOption[],
): Subject | null {
  const subject = subjects.find((item) => item.id === id);
  if (subject) return subject;

  const elective = electives.find((item) => item.id === id);
  if (elective) {
    return {
      id: elective.id,
      name: elective.name,
      shortName: elective.shortName,
      period: 0,
      preRequisites: elective.preRequisites,
      postRequisites: [],
      credits: elective.credits,
      curriculum: elective.curriculum,
      difficultyLevel: '',
      evaluationStyle: elective.evaluationStyle,
      teachers: elective.teachers,
      teacherHistory: [],
      advice: elective.advice,
      availability: '',
      schedule: '',
    };
  }

  const humanity = humanities.find((item) => item.id === id);
  if (humanity) {
    return {
      id: humanity.id,
      name: humanity.name,
      shortName: humanity.shortName,
      period: 0,
      preRequisites: [],
      postRequisites: [],
      credits: humanity.credits,
      curriculum: '',
      difficultyLevel: '',
      evaluationStyle: '',
      teachers: '',
      teacherHistory: [],
      advice: '',
      availability: '',
      schedule: '',
    };
  }

  return null;
}