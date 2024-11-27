module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential', // Vue 3 用の基本設定
    'eslint:recommended', // 推奨される ESLint のルールセット
    'plugin:prettier/recommended', // Prettier と統合するための設定
  ],
  parserOptions: {
    parser: 'babel-eslint', // ES6+ と JSX を解析するため
  },
  rules: {
    // 必要に応じて ESLint のルールを追加
    'vue/multi-word-component-names': 'off', // コンポーネント名のルールをオフにする
  },
};
