import type { Subject, SubjectStatus } from '../types/subject.types';

interface GetSubjectStatusParams {
  subject: Subject;
  completedIds: string[];
  selectedSubject: Subject | null;
}

export function getSubjectStatus({ subject, completedIds, selectedSubject }: GetSubjectStatusParams): SubjectStatus {
  if (selectedSubject && selectedSubject.id !== subject.id) {
    if (selectedSubject.postRequisites.includes(subject.id)) return 'highlighted-post';
    if (selectedSubject.preRequisites.includes(subject.id)) return 'highlighted-pre';
  }

  if (completedIds.includes(subject.id)) return 'completed';

  const isAvailable = subject.preRequisites.every((id) => completedIds.includes(id));
  return isAvailable ? 'available' : 'locked';
}