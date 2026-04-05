# AWS デプロイ手順

## 構成

```
EC2 #1 (フロントエンド): 13.113.236.120
└── Nginx → dist/（静的ファイル）

EC2 #2 (バックエンド): 52.194.225.125
└── java -jar kyudo_app.jar (port 8082)

RDS: kyudo-app-db.cbie000oqib4.ap-northeast-1.rds.amazonaws.com
└── MySQL 8.0 (port 3306)
```

---

## バックエンド更新

```bash
ssh -i ~/.ssh/kyudo-backend-key.pem ec2-user@52.194.225.125
cd kyodoApp_backend
git pull
./mvnw clean package -DskipTests
pkill -f "java -jar"
nohup java -jar target/*.jar \
  --spring.datasource.url=jdbc:mysql://kyudo-app-db.cbie000oqib4.ap-northeast-1.rds.amazonaws.com:3306/kyudo_app \
  --spring.datasource.username=admin \
  --spring.datasource.password=<パスワード> \
  > app.log 2>&1 &
```

## フロントエンド更新

```bash
# ローカルでビルド
cd ~/projects/sample_app/my-kyudo-app
npm run build

# EC2に転送
scp -i ~/.ssh/kyudo-frontend-key.pem -r dist/ ec2-user@13.113.236.120:/tmp/

# EC2で反映
ssh -i ~/.ssh/kyudo-frontend-key.pem ec2-user@13.113.236.120
sudo cp -r /tmp/dist/* /usr/share/nginx/html/
```
