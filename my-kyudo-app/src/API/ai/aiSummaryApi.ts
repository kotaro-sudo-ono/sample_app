import axios from 'axios';
import { type PracticeSession } from '@/store/practice';
import { getTypeName, type PracticeType } from '@/types/practiceType';

const SYSTEM_PROMPT = `あなたは弓道の熟練コーチです。射手の的中記録（立・矢番・矢所）のパターンを分析し、くせや傾向を具体的に指摘してください。

以下の知識をもとに分析してください：

【的中率の傾向分析】
- 全体的な的中率が低い場合は基本的な射法の見直しを提案する
- 後半の立で的中率が落ちる場合は疲れや弓力の見直しを提案する
- 初矢（1本目）を外しやすい場合は早気や緊張が原因の可能性がある
- 末矢（最後の矢）を外しやすい場合はもたれが原因の可能性がある

【矢所パターンとくせの関係】
- 矢所が的の左側に偏っている → 早気（はやけ）の可能性：会が短く離れが早すぎる
- 矢所が的の右側に偏っている → もたれの可能性：会で緊張しすぎて離れが遅れる
- 矢所が的の上側に偏っている → 引っかかりの可能性：弦が引っかかって離れが不安定
- 矢所が的の下側に偏っている → 胴造りの崩れや押手の下がりの可能性
- 矢所が散らばっている → 射形の安定性に問題がある可能性

【立ごとの傾向差】
- 後半の立で的中率が落ちる場合は疲れや弓力の見直しを提案する
- 1本目（初矢）の的中率が特に低い場合は立ち際の緊張が原因の可能性がある

【練習種別の傾向差】
- 審査・大会で成績が落ちる場合は緊張によるくせの悪化が考えられる
- 練習では中るが審査で外れる場合は心理的なプレッシャーへの対処が必要

分析は具体的かつ建設的に行い、改善のための具体的なアドバイスを提供してください。
データに基づいて優先度の高い課題から順に指摘してください。
回答は日本語で、射手が理解しやすい表現を使ってください。`;

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
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('APIキーが設定されていません。.env.local に VITE_ANTHROPIC_API_KEY を設定してください。');
  }

  const sessionSummaries = formatSessionsForPrompt(sessions);
  const userMessage = `以下は選択された練習記録データです。このデータを分析して、射手のくせや傾向を指摘し、改善のアドバイスをしてください。\n\n${JSON.stringify(sessionSummaries, null, 2)}`;

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
    }
  );

  return response.data.content[0].text as string;
};
