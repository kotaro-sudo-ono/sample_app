export const PracticeTypes = {
  Practice: { label: "練習", id: 1 },
  Tournament: { label: "大会", id: 2 },
  Examination: { label: "審査", id: 3 },
  Other: { label: "その他", id: 100 },
} as const;

export type PracticeTypeKey = keyof typeof PracticeTypes;
export type PracticeType = typeof PracticeTypes[PracticeTypeKey]['id'];
 
// キーからIDを取得
export const getTypeId = (practiceTypeKey: PracticeTypeKey): number => {
  return PracticeTypes[practiceTypeKey].id;
};

// IDからラベルを取得
export const getTypeName = (id: PracticeType): string => {
  const found = Object.values(PracticeTypes).find((p) => p.id === id);
  return found ? found.label : "不明";
};