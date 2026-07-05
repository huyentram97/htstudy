# Hướng dẫn Deploy H-T.Study lên Production

## Tổng quan

Tài liệu này hướng dẫn triển khai H-T.Study eLearning Platform lên môi trường public, phục vụ nhiều người dùng truy cập qua internet.

## Lựa chọn hạ tầng

### Option A: VPS đơn giản (Chi phí thấp, phù hợp khởi đầu)

| Thành phần | Dịch vụ | Chi phí ước tính/tháng |
|------------|---------|----------------------|
| Server | DigitalOcean / Vultr / Linode (4 vCPU, 8GB RAM) | $48-80 |
| Database | PostgreSQL trên cùng VPS hoặc managed | $0-15 |
| Domain | .vn hoặc .com | ~$10/năm |
| SSL | Let's Encrypt (miễn phí) | $0 |
| CDN | Cloudflare Free | $0 |
| Email | Gmail/Mailgun | $0-10 |
| **Tổng** | | **~$50-100/tháng** |

**Phù hợp:** < 500 users đồng thời, MVP, giai đoạn đầu

### Option B: Cloud managed (Scalable, production-grade)

| Thành phần | Dịch vụ | Chi phí ước tính/tháng |
|------------|---------|----------------------|
| Compute | AWS ECS / GCP Cloud Run / Azure Container Apps | $100-300 |
| Database | AWS RDS PostgreSQL / GCP Cloud SQL | $50-150 |
| Cache | AWS ElastiCache Redis | $30-80 |
| Search | AWS OpenSearch / Elastic Cloud | $50-150 |
| Storage | AWS S3 / GCP Cloud Storage | $10-30 |
| Queue | AWS SQS / CloudAMQP | $10-30 |
| CDN | CloudFront / Cloudflare | $10-50 |
| Auth | Keycloak on ECS / Auth0 | $0-50 |
| AI | OpenAI API (pay per use) | $50-500 |
| Domain + SSL | Route53 + ACM | $10 |
| **Tổng** | | **~$300-1500/tháng** |

**Phù hợp:** 500-5000+ users, enterprise, cần scale

### Option C: AWS (Đề xuất cho production)

```
Internet → CloudFront (CDN) → ALB (Load Balancer)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ECS Fargate      ECS Fargate      ECS Fargate
              (API pods)       (API pods)       (AI workers)
                    │               │               │
          ┌────────┴────────┬──────┴─────┬─────────┘
          ▼                 ▼            ▼
     RDS PostgreSQL    ElastiCache    SQS Queue
     (Multi-AZ)        (Redis)       (AI Tasks)
          │
          ▼
     S3 (Files, Media, Backups)
```

## Deploy nhanh với VPS (Option A - Khuyến nghị để bắt đầu)

### Bước 1: Chuẩn bị domain

1. Mua domain (VD: htstudy.vn, htstudy.com)
2. Trỏ DNS về IP VPS:
   - `A record: @ → <VPS_IP>`
   - `A record: www → <VPS_IP>`
   - `A record: api → <VPS_IP>` (nếu tách subdomain)

### Bước 2: Setup VPS

Yêu cầu tối thiểu:
- Ubuntu 22.04 LTS
- 4 vCPU, 8GB RAM, 80GB SSD
- Docker + Docker Compose đã cài

```bash
# SSH vào VPS
ssh root@<VPS_IP>

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Install Nginx (reverse proxy)
apt install nginx certbot python3-certbot-nginx -y
```

### Bước 3: Clone và cấu hình

```bash
# Clone project
git clone <your-repo-url> /opt/htstudy
cd /opt/htstudy

# Tạo file production environment
cp apps/api/.env.local apps/api/.env.production
```

Sửa `apps/api/.env.production`:
```env
PORT=3001
NODE_ENV=production

# Database - đổi password mạnh
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=htstudy
DB_PASSWORD=<STRONG_PASSWORD_HERE>
DB_DATABASE=htstudy
DB_LOGGING=false

# JWT - đổi secret key mạnh
JWT_SECRET=<RANDOM_64_CHAR_STRING>
JWT_EXPIRES_IN=60m

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_NODE=http://elasticsearch:9200

# RabbitMQ
RABBITMQ_URL=amqp://htstudy:<STRONG_PASSWORD>@rabbitmq:5672

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<STRONG_ACCESS_KEY>
MINIO_SECRET_KEY=<STRONG_SECRET_KEY>
MINIO_BUCKET=htstudy-files

# Frontend URL
CORS_ORIGINS=https://htstudy.vn,https://www.htstudy.vn

# AI
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
OPENAI_MODEL=gpt-4o
```

### Bước 4: Production Docker Compose

Tạo `docker-compose.prod.yml`:

### Bước 5: Build và chạy

```bash
cd /opt/htstudy

# Set production passwords (tạo file .env cho docker-compose)
cat > .env << EOF
DB_PASSWORD=<your_strong_db_password>
REDIS_PASSWORD=<your_strong_redis_password>
RABBITMQ_PASSWORD=<your_strong_rabbitmq_password>
MINIO_ACCESS_KEY=<your_minio_access>
MINIO_SECRET_KEY=<your_minio_secret>
EOF

# Build và start
docker compose -f docker-compose.prod.yml up -d --build

# Check logs
docker compose -f docker-compose.prod.yml logs -f api
```

### Bước 6: Cấu hình Nginx + SSL

```bash
# Copy nginx config
cp nginx/htstudy.conf /etc/nginx/sites-available/htstudy
ln -s /etc/nginx/sites-available/htstudy /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

# Get SSL certificate (miễn phí từ Let's Encrypt)
certbot --nginx -d htstudy.vn -d www.htstudy.vn

# Reload nginx
systemctl reload nginx
```

### Bước 7: Verify

```bash
# Check API health
curl https://htstudy.vn/api/v1/health

# Expected response:
# {"success":true,"data":{"status":"ok","timestamp":"...","version":"1.0.0"}}
```

## Checklist trước khi public

### Bảo mật
- [ ] Đổi tất cả default passwords (DB, Redis, RabbitMQ, MinIO)
- [ ] JWT_SECRET là random string ≥64 chars
- [ ] SSL/HTTPS enabled
- [ ] Firewall chỉ mở port 80, 443, 22 (SSH)
- [ ] Database port (5432) KHÔNG expose ra internet
- [ ] Rate limiting enabled
- [ ] CORS chỉ cho phép domain chính thức

### Performance
- [ ] Cloudflare CDN activated (DNS proxy)
- [ ] Gzip enabled
- [ ] Static assets cached (1 year)
- [ ] Database indexes đã tạo (init-db.sql có sẵn)
- [ ] Redis cache hoạt động

### Monitoring
- [ ] Setup Uptime monitoring (UptimeRobot miễn phí)
- [ ] Docker container auto-restart (restart: always)
- [ ] Disk space alert (df -h)
- [ ] Backup schedule configured

### Backup
- [ ] Daily database backup to external location
- [ ] Object storage backup
- [ ] Backup verification test

## Auto Backup Script

Tạo cronjob backup database hàng ngày:

```bash
# /opt/htstudy/scripts/backup.sh
#!/bin/bash
BACKUP_DIR="/opt/backups/htstudy"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec htstudy-postgres pg_dump -U htstudy htstudy | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db_$DATE.sql.gz"
```

```bash
# Add to crontab (daily at 2 AM)
chmod +x /opt/htstudy/scripts/backup.sh
crontab -e
# Add: 0 2 * * * /opt/htstudy/scripts/backup.sh
```

## CI/CD Pipeline (GitHub Actions)

Khi push code lên main branch → auto build và deploy:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/htstudy
            git pull origin main
            docker compose -f docker-compose.prod.yml up -d --build
            echo "Deploy completed at $(date)"
```

## Scale khi traffic tăng

### Giai đoạn 1: Vertical scaling (< 1000 users)
- Upgrade VPS: 8 vCPU, 16GB RAM

### Giai đoạn 2: Tách services (1000-5000 users)
- Database riêng (managed RDS/Cloud SQL)
- Redis riêng
- Multiple API containers (load balanced)

### Giai đoạn 3: Full cloud (> 5000 users)
- Chuyển sang AWS ECS / GCP Cloud Run
- Auto-scaling groups
- Multi-AZ database
- CDN global distribution
- Managed Elasticsearch

## Tóm tắt lệnh triển khai nhanh

```bash
# 1. SSH vào VPS
ssh root@<VPS_IP>

# 2. Clone project
git clone <repo> /opt/htstudy && cd /opt/htstudy

# 3. Cấu hình environment
cp apps/api/.env.local apps/api/.env.production
# Edit .env.production với passwords mạnh

# 4. Start services
docker compose -f docker-compose.prod.yml up -d --build

# 5. Setup SSL
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 6. Verify
curl https://yourdomain.com/api/v1/health

# Done! Website live tại https://yourdomain.com
```
