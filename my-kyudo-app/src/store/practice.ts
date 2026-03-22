import { defineStore } from 'pinia';
import { saveRecord, updateRecord, fetchRecordsByUser, type SaveArrow, type ArrowRecord } from '@/API/record/recordApi';
import { authStore } from '@/store/auth';
import { notificationStore } from '@/store/notification';

export type Arrow = {
  hit: boolean;
  position?: { x: number; y: number };
};

export type Stand = {
  arrows: Arrow[];
};

export type PracticeSession = {
  id: string;
  date: string;
  stands: Stand[];
  notes: string;
  sessionTypeId: number;
  totalArrows: number;
  totalHits: number;
};

export const practiceStore = defineStore('practice', {
  state: () => ({
    sessions: [] as PracticeSession[],
  }),
  getters: {
    getSessions: (state) => state.sessions,
    getSessionsByDate: (state) => {
      return (date: string) => state.sessions.filter((s) => s.date.startsWith(date));
    },
    getSessionDates: (state) => {
      const dates = new Set<string>();
      state.sessions.forEach((s) => dates.add(s.date.substring(0, 10)));
      return dates;
    },
  },
  actions: {
    addSession(session: Omit<PracticeSession, 'id' | 'totalArrows' | 'totalHits'>) {
      const totalArrows = session.stands.reduce((sum, s) => sum + s.arrows.length, 0);
      const totalHits = session.stands.reduce(
        (sum, s) => sum + s.arrows.filter((a) => a.hit).length,
        0
      );

      const newSession: PracticeSession = {
        ...session,
        id: crypto.randomUUID(),
        totalArrows,
        totalHits,
      };

      this.sessions.push(newSession);
      this.syncToBackend(newSession);

      return newSession;
    },
    deleteSession(id: string) {
      this.sessions = this.sessions.filter((s) => s.id !== id);
    },
    updateSession(updated: PracticeSession) {
      const totalArrows = updated.stands.reduce((sum, stand) => sum + stand.arrows.length, 0);
      const totalHits = updated.stands.reduce((sum, stand) => sum + stand.arrows.filter((arrow) => arrow.hit).length, 0);
      const index = this.sessions.findIndex((session) => session.id === updated.id);
      if (index === -1) return;
      const previous = this.sessions[index];
      this.sessions[index] = { ...updated, totalArrows, totalHits };
      this.syncUpdateToBackend({ ...updated, totalArrows, totalHits }, previous);
    },
    async syncUpdateToBackend(session: PracticeSession, previous: PracticeSession) {
      const arrows: SaveArrow[] = session.stands.flatMap((stand, standIndex) =>
        stand.arrows.map((arrow, arrowIndex) => ({
          arrowNumber: arrowIndex + 1,
          standNumber: standIndex + 1,
          positionX: arrow.position?.x,
          positionY: arrow.position?.y,
          isHit: arrow.hit,
        }))
      );
      try {
        await updateRecord(session.id, {
          hitCount: session.totalHits,
          totalShots: session.totalArrows,
          practiceDate: session.date,
          practiceTypeId: session.sessionTypeId,
          arrows,
        });
        const auth = authStore();
        const token = auth.token;
        if (token) {
          const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
          const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
          const userId = JSON.parse(atob(padded)).sub;
          await this.fetchFromBackend(userId);
        }
      } catch {
        const index = this.sessions.findIndex((existingSession) => existingSession.id === previous.id);
        if (index !== -1) {
          this.sessions[index] = previous;
        }
        notificationStore().show('記録の更新に失敗しました。もう一度お試しください。');
      }
    },
    async syncToBackend(session: PracticeSession) {
      const auth = authStore();
      const token = auth.token;
      if (!token) {
        console.warn('[syncToBackend] JWTトークンがありません。ログインしてから保存してください。');
        return;
      }

      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const payload = JSON.parse(atob(padded));
      const userId = payload.sub;

      const arrows: SaveArrow[] = session.stands.flatMap((stand, standIndex) =>
        stand.arrows.map((arrow, arrowIndex) => ({
          arrowNumber: arrowIndex + 1,
          standNumber: standIndex + 1,
          positionX: arrow.position?.x,
          positionY: arrow.position?.y,
          isHit: arrow.hit,
        }))
      );

      try {
        await saveRecord({
          hitCount: session.totalHits,
          totalShots: session.totalArrows,
          userId,
          practiceDate: session.date,
          practiceTypeId: session.sessionTypeId,
          arrows,
        });
      } catch (error) {
        console.error('[syncToBackend] バックエンドへの送信に失敗しました:', error);
        this.sessions = this.sessions.filter((existingSession) => existingSession.id !== session.id);
        notificationStore().show('記録の保存に失敗しました。もう一度お試しください。');
        return;
      }

      try {
        await this.fetchFromBackend(userId);
        notificationStore().show('記録を保存しました', 'success');
      } catch {
        console.warn('[syncToBackend] 保存後のデータ取得に失敗しました。');
      }
    },
    async fetchFromBackend(userId: string) {
      try {
        const res = await fetchRecordsByUser(userId);
        const data = res.data;

        if (Array.isArray(data)) {
          this.sessions = data
            .filter((record) => record.recordId)
            .map((record) => {
              const stands: Stand[] = (() => {
                if (!record.arrows || record.arrows.length === 0) return [];
                const standMap = new Map<number, Arrow[]>();
                const sortedArrows = [...record.arrows].sort((a, b) => {
                  const snA = a.standNumber ?? 1;
                  const snB = b.standNumber ?? 1;
                  if (snA !== snB) return snA - snB;
                  return a.arrowNumber - b.arrowNumber;
                });
                for (const arrow of sortedArrows) {
                  const sn = arrow.standNumber ?? 1;
                  if (!standMap.has(sn)) standMap.set(sn, []);
                  standMap.get(sn)!.push({
                    hit: arrow.hit,
                    position:
                      arrow.positionX != null && arrow.positionY != null
                        ? { x: arrow.positionX, y: arrow.positionY }
                        : undefined,
                  });
                }
                return Array.from(standMap.entries())
                  .sort((a, b) => a[0] - b[0])
                  .map(([, arrows]) => ({ arrows }));
              })();

              return {
                id: record.recordId,
                date: record.practiceDate ?? new Date().toISOString(),
                stands,
                notes: '',
                sessionTypeId: record.practiceTypeId ?? 0,
                totalArrows: record.totalShots,
                totalHits: record.hitCount,
              };
            });
        }
      } catch {
        console.warn('バックエンドからのデータ取得に失敗しました。');
      }
    },
  },
});
