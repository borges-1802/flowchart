export interface ElectiveOption {
  id: string;
  name: string;
  shortName: string;
  preRequisites: string[];
  credits: number;
  curriculum: string;
  evaluationStyle: string;
  teachers: string;
  advice: string;
}