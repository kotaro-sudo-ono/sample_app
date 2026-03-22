import { api } from '@/shared/api/api';

export type MonthlySummary = {
  month: string;
  hitCount: number;
  totalShots: number;
  hitRate: number;
};

export type ArrowRecord = {
  arrowId: string;
  arrowNumber: number;
  positionX?: number;
  positionY?: number;
  hit: boolean;
};

export type RecordItem = {
  recordId: string;
  hitCount: number;
  totalShots: number;
  practiceDate?: string;
  practiceTypeId?: number;
  practiceType?: string;
  arrows: ArrowRecord[];
};

export type SaveArrow = {
  arrowNumber: number;
  positionX?: number;
  positionY?: number;
  isHit: boolean;
};

export type SaveRecordRequest = {
  hitCount: number;
  totalShots: number;
  userId: string;
  practiceDate: string;
  practiceTypeId: number;
  arrows: SaveArrow[];
};

export type UpdateRecordRequest = {
  hitCount: number;
  totalShots: number;
  practiceDate: string;
  practiceTypeId: number;
  arrows: SaveArrow[];
};

export const saveRecord = (data: SaveRecordRequest) => {
  return api.post('/record/save', data);
};

export const updateRecord = (recordId: string, data: UpdateRecordRequest) => {
  return api.put(`/record/${recordId}`, data);
};

export const fetchRecordsByUser = (userId: string) => {
  return api.get<RecordItem[]>(`/record/user/${userId}`);
};

export const fetchMonthlySummaryByUser = (userId: string, months: string[]) => {
  const params = new URLSearchParams();
  months.forEach((m) => params.append('months', m));
  return api.get<MonthlySummary[]>(`/record/user/${userId}/monthly-summary?${params.toString()}`);
};
