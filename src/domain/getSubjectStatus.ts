import type { Subject, SubjectStatus } from '../types/subject.types';

interface GetSubjectStatusParams {
  id: string;
  preRequisites: string[];
  completedIds: string[];
  inProgressIds: string[];
  selectedSubject: Subject | null;
}

export function getSubjectStatus({
  id,
  preRequisites,
  completedIds,
  inProgressIds,
  selectedSubject,
}: GetSubjectStatusParams): SubjectStatus {
  if (selectedSubject && selectedSubject.id !== id) {
    if (selectedSubject.postRequisites.includes(id)) return 'highlighted-post';
    if (selectedSubject.preRequisites.includes(id)) return 'highlighted-pre';
  }

  if (completedIds.includes(id)) return 'completed';
  if (inProgressIds.includes(id)) return 'in-progress';

  const isAvailable = preRequisites.every((reqId) => completedIds.includes(reqId));
  return isAvailable ? 'available' : 'locked';
}