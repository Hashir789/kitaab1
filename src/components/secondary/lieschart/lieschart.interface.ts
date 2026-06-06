export interface LiesData {
  month: string;
  days: Array<{
    day: number;
    lies: number;
  }>;
}