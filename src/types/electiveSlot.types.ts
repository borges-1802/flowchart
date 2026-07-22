export type ElectiveKind = 'condicionada' | 'humanidades' | 'livre';

export interface ElectiveSlot {
  id: string;
  period: number;
  kind: ElectiveKind;
}