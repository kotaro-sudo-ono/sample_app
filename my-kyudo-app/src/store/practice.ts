import { defineStore } from 'pinia';
import { saveRecord, fetchRecordsByUser, type SaveArrow, type ArrowRecord } from '@/API/record/recordApi';
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
    async syncToBackend(session: PracticeSession) {
      const auth = authStore();
      const token = auth.token;
      if (!token) {
        console.warn('[syncToBackend] JWTトークンがありません。ログインしてから保存してください。');
        return;
      }

      try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const payload = JSON.parse(atob(padded));
        const userId = payload.sub;

        const arrows: SaveArrow[] = [];
        let arrowNum = 1;
        session.stands.forEach((stand) => {
          stand.arrows.forEach((arrow) => {
            arrows.push({
              arrowNumber: arrowNum++,
              positionX: arrow.position?.x,
              positionY: arrow.position?.y,
              isHit: arrow.hit,
            });
          });
        });

        await saveRecord({
          hitCount: session.totalHits,
          totalShots: session.totalArrows,
          userId,
          practiceDate: session.date,
          practiceTypeId: session.sessionTypeId,
          arrows,
        });

        await this.fetchFromBackend(userId);
      } catch (error) {
        console.error('[syncToBackend] バックエンドへの送信に失敗しました:', error);
        this.sessions = this.sessions.filter((s) => s.id !== session.id);
        notificationStore().show('記録の保存に失敗しました。もう一度お試しください。');
      }
    },
    async fetchFromBackend(userId: string) {
      try {
        const res = await fetchRecordsByUser(userId);
        console.log("res:", res)
        const data = res.data;

        if (Array.isArray(data)) {
          this.sessions = data
            .filter((record) => record.recordId)
            .map((record) => {
              const stands: Stand[] =
                record.arrows && record.arrows.length > 0
                  ? [
                      {
                        arrows: record.arrows.map((arrow: ArrowRecord) => ({
                          hit: arrow.hit,
                          position:
                            arrow.positionX != null && arrow.positionY != null
                              ? { x: arrow.positionX, y: arrow.positionY }
                              : undefined,
                        })),
                      },
                    ]
                  : [];

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
