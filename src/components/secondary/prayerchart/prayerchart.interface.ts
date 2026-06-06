export type PrayerType = "Fajar" | "Zuhr" | "Asr" | "Maghrib" | "Isha";
export type PrayerFilter = "All" | "Fajr" | "Zuhr" | "Asr" | "Maghrib" | "Isha";
export type PrayerStatus = "prayed on time" | "prayed late" | "prayed in time" | "never prayed";

export interface PrayerData {
  y: number;
  z: number;
  name: string;
}

export type PrayerChartProps = {
  filter: PrayerFilter;
};