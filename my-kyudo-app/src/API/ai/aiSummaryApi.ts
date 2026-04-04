import axios from 'axios';
import { type PracticeSession } from '@/store/practice';
import { getTypeName, type PracticeType } from '@/types/practiceType';
import kyudoKnowledge from './kyudoKnowledge.json';

type KnowledgeCategory = {
  name: string;
  items: string[];
};

const buildKnowledgeText = (): string =>
  kyudoKnowledge.categories
    .map(
      (category: KnowledgeCategory) =>
        `【${category.name}】\n${category.items.map((item) => `- ${item}`).join('\n')}`
    )
    .join('\n\n');

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
${buildKnowledgeText()}

# 制約
- 上記「弓道ナレッジ」に記載された知識のみを使うこと
- ナレッジに根拠のないアドバイスはしない

# 出力ルール（絶対に守る）
以下の形式で出力すること：

【くせ・傾向】
- （矢所・的中パターンから読み取れる射手のくせ。断定せず「〜の可能性がある」「〜が考えられる」など可能性として列挙する）

【次の練習でやること】
- （具体的な行動を3個。すぐ実践できる内容にする）

# 禁止事項
- 抽象的な表現（例：「意識しましょう」だけ）
- データに基づかない推測
- 同じ内容の繰り返し
- ユーザーへの共感・褒め言葉・評価（例：「素晴らしい」「惜しかったですね」）
- 総評セクション

# 出力スタイル
- 簡潔で読みやすく
- 各項目は1〜2行以内に収める
- 実際の指導のように書く
- Markdownは使わない（**太字**・番号付きリストなど禁止）`;

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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
    {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 4096 },
    },
    {
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    }
  );

  const candidates = response.data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('AIからの応答がありませんでした');
  }
  const text = candidates[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('AIの応答形式が不正です');
  }
  return text;
};
