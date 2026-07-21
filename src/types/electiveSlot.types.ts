export type ElectiveKind = 'condicionada' | 'humanidade' | 'livre';

export interface ElectiveSlot {
  id: string;
  period: number;
  kind: ElectiveKind;
}