import axios from 'axios';
import { type PracticeSession } from '@/store/practice';
import { getTypeName, type PracticeType } from '@/types/practiceType';

const SYSTEM_PROMPT = `あなたは弓道の専門コーチです。
初心者〜中級者に対して、実践的で具体的なアドバイスを行ってください。
必ず日本語で回答してください。

# 目的
与えられた練習データから課題を分析し、次の練習で改善できる具体的な行動を提示すること。

# 分析ルール
- 的中率の推移を見る
- 直近のデータを重視する
- 安定しているか（ばらつき）を見る
- 極端な変化があれば原因を推測する

# 弓道ナレッジ
- 会（かい）の安定が最重要
- 離れは意図的に出すのではなく自然に出る状態が理想
- 的中率が低いときは細かい技術より基本動作を優先
- 体のブレは的中率に直結する
- 手の内の緩みは矢のブレにつながる
- 矢所が的の左側に偏っている → 早気（はやけ）の可能性：会が短く離れが早すぎる
- 矢所が的の右側に偏っている → もたれの可能性：会で緊張しすぎて離れが遅れる
- 矢所が的の上側に偏っている → 引っかかりの可能性：弦が引っかかって離れが不安定
- 矢所が的の下側に偏っている → 胴造りの崩れや押手の下がりの可能性
- 初矢（1本目）を外しやすい場合は早気や緊張が原因の可能性がある
- 末矢（最後の矢）を外しやすい場合はもたれが原因の可能性がある
- 審査・大会で成績が落ちる場合は緊張によるくせの悪化が考えられる

# 出力ルール（絶対に守る）
以下の形式で出力すること：

【総評】
（全体の傾向を一言で）

【良い点】
- （データに基づいた具体的な良い点を2〜3個）

【改善点】
- （原因とセットで2〜3個）

【次の練習でやること】
- （具体的な行動を3個。すぐ実践できる内容にする）

# 禁止事項
- 抽象的な表現（例：「意識しましょう」だけ）
- データに基づかない推測
- 同じ内容の繰り返し

# 出力スタイル
- 簡潔で読みやすく
- 1行は長すぎない
- 実際の指導のように書く`;

type ArrowSummary = {
  arrowNumber: number;
  hit: boolean;
  position?: { x: number; y: number };
};

type StandSummary = {
  standNumber: number;
  arrows: ArrowSummary[];
};

type SessionSummary = {
  date: string;
  type: string;
  totalArrows: number;
  totalHits: number;
  hitRate: string;
  stands: StandSummary[];
};

export const formatSessionsForPrompt = (sessions: PracticeSession[]): SessionSummary[] => {
  return sessions.map((session) => {
    const stands: StandSummary[] = session.stands.map((stand, standIndex) => ({
      standNumber: standIndex + 1,
      arrows: stand.arrows.map((arrow, arrowIndex) => {
        const entry: ArrowSummary = {
          arrowNumber: arrowIndex + 1,
          hit: arrow.hit,
        };
        if (arrow.position !== undefined) {
          entry.position = {
            x: Math.round(arrow.position.x * 100) / 100,
            y: Math.round(arrow.position.y * 100) / 100,
          };
        }
        return entry;
      }),
    }));

    return {
      date: session.date.substring(0, 10),
      type: getTypeName(session.sessionTypeId as PracticeType),
      totalArrows: session.totalArrows,
      totalHits: session.totalHits,
      hitRate:
        session.totalArrows > 0
          ? `${Math.round((session.totalHits / session.totalArrows) * 100)}%`
          : '0%',
      stands,
    };
  });
};

export const fetchAiCoachAdvice = async (sessions: PracticeSession[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('APIキーが設定されていません。.env.local に VITE_GOOGLE_AI_API_KEY を設定してください。');
  }

  const sessionSummaries = formatSessionsForPrompt(sessions);
  const userMessage = `以下の練習データを分析してください:\n\n${JSON.stringify(sessionSummaries, null, 2)}`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 1024 },
    },
    {
      headers: { 'content-type': 'application/json' },
    }
  );

  return response.data.candidates[0].content.parts[0].text as string;
};
