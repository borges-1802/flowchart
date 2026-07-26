import { useProgress } from '../contexts/ProgressContext';
import { calculateCredits } from '../domain/creditsSummary';
import subjectsData from '../data/subjects.json';
import type { Subject } from '../types/subject.types';

export function useCredits() {
  const { completedIds } = useProgress();
  return calculateCredits(subjectsData as Subject[], completedIds);
}