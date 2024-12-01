module.exports = {
  root: true,
  env: {
    node: true, // Node.js 環境をサポート
    browser: true, // ブラウザ環境をサポート
  },
  parser: '@typescript-eslint/parser', // TypeScript を解析するパーサ
  parserOptions: {
    ecmaVersion: 2020, // ECMAScript 2020 の構文に対応
    sourceType: 'module', // モジュールとして読み込む
    ecmaFeatures: {
      jsx: true, // JSX をサポート
    },
  },
  plugins: ['@typescript-eslint', 'vue', 'prettier'], // TypeScript と Vue と Prettier のプラグインを有効化
  extends: [
    'eslint:recommended', // ESLint の推奨ルール
    'plugin:vue/vue3-essential', // Vue 3 用の基本的な設定
    'plugin:@typescript-eslint/recommended', // TypeScript 用の推奨設定
    'plugin:prettier/recommended', // Prettier を統合して ESLint のルールと合わせる
  ],
  rules: {
    // 必要に応じてルールを上書き
    'vue/multi-word-component-names': 'off', // コンポーネント名のルールをオフ
    '@typescript-eslint/no-unused-vars': ['warn'], // TypeScript の未使用変数に警告を表示
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 関数の戻り値に型を強制しない
    '@typescript-eslint/no-explicit-any': 'off', // any 型の使用を許可
  },
  settings: {
    // TypeScript のパス解決を設定
    'import/resolver': {
      typescript: {}, // TypeScript の解決設定
    },
  },
};
