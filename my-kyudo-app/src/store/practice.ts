import { defineStore } from 'pinia';
import { saveRecord, fetchRecordsByUser, type SaveArrow, type ArrowRecord } from '@/API/record/recordApi';
import { authStore } from '@/store/auth';

export interface Arrow {
  hit: boolean;
  position?: { x: number; y: number };
}

export interface Stand {
  arrows: Arrow[];
}

export interface PracticeSession {
  id: string;
  date: string;
  stands: Stand[];
  notes: string;
  sessionTypeId: number;
  totalArrows: number;
  totalHits: number;
}

export const practiceStore = defineStore('practice', {
  state: () => ({
    sessions: JSON.parse(localStorage.getItem('practice_sessions') || '[]') as PracticeSession[],
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
      this.persistToStorage();

      console.log('[addSession] syncToBackend を呼び出します。session.id:', newSession.id);
      this.syncToBackend(newSession);

      return newSession;
    },
    deleteSession(id: string) {
      this.sessions = this.sessions.filter((s) => s.id !== id);
      this.persistToStorage();
    },
    persistToStorage() {
      localStorage.setItem('practice_sessions', JSON.stringify(this.sessions));
    },
    async syncToBackend(session: PracticeSession) {
      const auth = authStore();
      const token = auth.token;
      if (!token) {
        console.warn('[syncToBackend] JWTトークンがありません。ログインしてから保存してください。');
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
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
      } catch (error) {
        console.error('[syncToBackend] バックエンドへの送信に失敗しました:', error);
        console.warn('ローカルには保存済みです。');
      }
    },
    async fetchFromBackend(userId: string) {
      try {
        const res = await fetchRecordsByUser(userId);
        const data = res.data;

        if (Array.isArray(data)) {
          data.forEach((record) => {
            const existing = this.sessions.find((s) => s.id === record.recordId);
            if (!existing && record.recordId) {
              const stands: Stand[] =
                record.arrows && record.arrows.length > 0
                  ? [
                      {
                        arrows: record.arrows.map((a: ArrowRecord) => ({
                          hit: a.isHit,
                          position:
                            a.positionX != null && a.positionY != null
                              ? { x: a.positionX, y: a.positionY }
                              : undefined,
                        })),
                      },
                    ]
                  : [];

              const backendSession: PracticeSession = {
                id: record.recordId,
                date: record.practiceDate ?? new Date().toISOString(),
                stands,
                notes: '',
                sessionTypeId: record.practiceTypeId ?? 0,
                totalArrows: record.totalShots,
                totalHits: record.hitCount,
              };
              this.sessions.push(backendSession);
            }
          });
          this.persistToStorage();
        }
      } catch {
        console.warn('バックエンドからのデータ取得に失敗しました。');
      }
    },
  },
});
