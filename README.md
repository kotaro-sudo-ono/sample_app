## 使用技術一覧
- TypeScript
- Vue
- vuetify

### アプリ名
- 団体向け的中管理アプリケーション（フロントエンド）

## 概要
- 部活動などの団体ごとに的中を管理することができる
- 個人単位での的中管理ができる
- 大会ごとの的中記録を確認できる
- 会場ごとの的中を確認できる
- 大会で対戦学校との的中の共有がリアルタイムでできる

## ディレクトリ名・ファイル名の命名
- ディレクトリ名はキャメルケースで作成
- ファイル名はパスカルケースで作成


##　必要なツール
- Docker（インストールされていること）
- Docker Compose（インストールされていること）
- VSCode（推奨：dev Containers拡張をインストール）

## 環境構築手順([バックエンドのリポジトリ](https://github.com/kotaro-sudo-ono/kyodoApp_backend)と合わせて使用する)

### vsCode使用の場合（推奨）
1. このリポジトリをクローン
2. dockerディレクトリに移動
`cd my-kyudo-app/docker`
3. dockerネットワークを作成（バックエンドが別コンテナのため通信に外部ネットワークを用いるため）
`docker network create app-network`
4. 画面右下ポップアップの「開発コンテナで再度開く」を押下

### vsCode以外使用の場合
1. このリポジトリをクローン
2. dockerディレクトリに移動
`cd my-kyudo-app/docker`
3. dockerネットワークを作成（バックエンドが別コンテナのため通信に外部ネットワークを用いるため）
`docker network create app-network`
4. コンテナをバックグラウンドで立ち上げる
`docker-compose up -d`
