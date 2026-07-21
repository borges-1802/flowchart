import type { Subject, SubjectStatus } from '../types/subject.types';

interface GetSubjectStatusParams {
  id: string;
  preRequisites: string[];
  completedIds: string[];
  selectedSubject: Subject | null;
}

export function getSubjectStatus({
  id,
  preRequisites,
  completedIds,
  selectedSubject,
}: GetSubjectStatusParams): SubjectStatus {
  if (selectedSubject && selectedSubject.id !== id) {
    if (selectedSubject.postRequisites.includes(id)) return 'highlighted-post';
    if (selectedSubject.preRequisites.includes(id)) return 'highlighted-pre';
  }

  if (completedIds.includes(id)) return 'completed';

  const isAvailable = preRequisites.every((reqId) => completedIds.includes(reqId));
  return isAvailable ? 'available' : 'locked';
}