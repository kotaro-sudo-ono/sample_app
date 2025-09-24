FROM node:23.7.0

WORKDIR /app

# package.json と yarn.lock をコピー
COPY package.json ./
COPY yarn.lock ./

# 依存関係をインストール
RUN yarn install

# 必要なソースファイルのみコピー
COPY src/ ./src/
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY shims-vue.d.ts ./

# 設定ファイル
COPY .prettierrc ./
COPY .eslintrc.ts ./
COPY .eslintignore ./
COPY .prettierignore ./

EXPOSE 5173

CMD ["yarn", "dev", "--host"]