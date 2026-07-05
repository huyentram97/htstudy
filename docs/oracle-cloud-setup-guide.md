# Hướng dẫn Setup Oracle Cloud Free Tier cho H-T.Study

## Bước 1: Đăng ký tài khoản Oracle Cloud

### Chuẩn bị:
- Email cá nhân (Gmail OK)
- Thẻ Visa/Mastercard (chỉ xác minh, KHÔNG trừ tiền)
- Số điện thoại VN

### Thực hiện:

1. Vào: **https://signup.cloud.oracle.com**

2. Điền thông tin:
   - Country: **Vietnam**
   - First Name / Last Name: tên thật
   - Email: email cá nhân
   - Nhấn **Verify my email** → vào email click link xác nhận

3. Sau khi verify email, điền tiếp:
   - Password: tạo password mạnh (ít nhất 8 ký tự, có chữ hoa + số + ký tự đặc biệt)
   - Cloud Account Name: `htstudy` (hoặc tên bạn muốn)
   - **Home Region: Singapore** (gần VN nhất, tốc độ tốt)
   
4. Điền địa chỉ:
   - Address: địa chỉ bất kỳ (nhà riêng OK)
   - City, State, Zip: đúng thông tin VN
   - Phone: số điện thoại VN (+84...)

5. **Payment Verification**:
   - Nhập thẻ Visa/Mastercard
   - Oracle sẽ hold ~$1 rồi refund ngay (hoặc $0 charge)
   - ⚠️ KHÔNG bị trừ tiền thật, chỉ verify thẻ sống

6. Chọn **Account Type**: chọn gì cũng được (Individual OK)

7. Nhấn **Start my free trial**

8. Đợi 5-15 phút để Oracle provision account

✅ Xong bước 1! Bạn sẽ nhận email "Your Oracle Cloud account is ready"

## Bước 2: Tạo VM (Virtual Machine)

1. Đăng nhập vào: **https://cloud.oracle.com**

2. Từ Dashboard, click **"Create a VM instance"** 
   (hoặc Menu ☰ → Compute → Instances → Create Instance)

3. Cấu hình instance:

### Name:
```
htstudy-server
```

### Placement:
- Availability Domain: chọn bất kỳ (AD-1 hoặc AD-2)

### Image and Shape:
- Click **"Edit"**
- Image: **Ubuntu** → chọn **Canonical Ubuntu 22.04** (aarch64)
- Shape: Click **"Change shape"**
  - Instance type: **Virtual machine**
  - Shape series: **Ampere** (ARM)
  - Shape: **VM.Standard.A1.Flex**
  - OCPUs: **1** (đủ cho website cá nhân)
  - Memory: **6 GB** (đủ chạy Docker + PostgreSQL + API)
  - → Click **Select shape**

### Networking:
- VCN: để mặc định hoặc tạo mới (auto-create)
- Subnet: public subnet
- ✅ **Assign a public IPv4 address** ← QUAN TRỌNG, phải tick!

### Add SSH keys:
- Chọn **"Generate a key pair for me"**
- Click **"Save private key"** → lưu file `.key` vào máy bạn
- ⚠️ GIỮ FILE NÀY CẨN THẬN — đây là chìa khóa SSH vào server

### Boot volume:
- Size: **50 GB** (free, đủ dùng)

4. Click **"Create"**

5. Đợi 1-3 phút → Status chuyển sang **RUNNING** ✅

6. Ghi lại **Public IP Address** (hiển thị trên trang instance)
   - Ví dụ: `152.70.xxx.xxx`

### ⚠️ Nếu gặp lỗi "Out of host capacity":
- Đổi sang Availability Domain khác (AD-2 hoặc AD-3)
- Hoặc giảm xuống 1 OCPU / 4GB RAM
- Hoặc đợi 30 phút thử lại
- Hoặc thử tạo vào sáng sớm (5-7h VN) khi ít người dùng

## Bước 3: Mở ports trên Oracle Cloud

Oracle mặc định CHẶN tất cả ports. Bạn cần mở port 80 và 443:

### 3a. Mở trên Security List (firewall của Oracle):

1. Menu ☰ → Networking → Virtual Cloud Networks
2. Click vào VCN đang dùng
3. Click vào **Public Subnet**
4. Click vào **Default Security List**
5. Click **"Add Ingress Rules"**
6. Thêm 2 rules:

**Rule 1 - HTTP:**
- Source CIDR: `0.0.0.0/0`
- Destination Port Range: `80`
- Description: HTTP

**Rule 2 - HTTPS:**
- Source CIDR: `0.0.0.0/0`
- Destination Port Range: `443`
- Description: HTTPS

7. Click **"Add Ingress Rules"**

### 3b. Mở trên iptables bên trong VM (sẽ làm ở bước sau khi SSH vào)

## Bước 4: SSH vào Server

### Trên Windows (dùng PowerShell hoặc CMD):

```powershell
# Di chuyển vào folder chứa file .key đã download
cd C:\Users\<tên_bạn>\Downloads

# SSH vào server (thay IP thật)
ssh -i ssh-key-*.key ubuntu@<PUBLIC_IP>
```

### Lần đầu:
- Gõ `yes` khi hỏi fingerprint
- Nếu báo lỗi permission file key → chạy:
```powershell
icacls "ssh-key-*.key" /inheritance:r /grant:r "%USERNAME%:R"
```

### Sau khi SSH thành công, bạn sẽ thấy:
```
ubuntu@htstudy-server:~$
```

✅ Bạn đã vào server!

## Bước 5: Cài đặt trên Server

Copy-paste từng block lệnh bên dưới:

### 5a. Mở firewall bên trong Ubuntu:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

### 5b. Update hệ thống:
```bash
sudo apt update && sudo apt upgrade -y
```

### 5c. Cài Docker:
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

**Logout rồi SSH lại** để docker group có hiệu lực:
```bash
exit
```
SSH lại vào, rồi test:
```bash
docker --version
```

### 5d. Cài Docker Compose:
```bash
sudo apt install docker-compose-plugin -y
docker compose version
```

### 5e. Cài Git:
```bash
sudo apt install git -y
```

## Bước 6: Deploy H-T.Study

### 6a. Clone project:
```bash
cd /opt
sudo git clone <URL_REPO_CUA_BAN> htstudy
sudo chown -R ubuntu:ubuntu /opt/htstudy
cd /opt/htstudy
```

Nếu chưa push code lên Git, bạn có thể tạo repo trên GitHub rồi push từ máy Windows:
```powershell
# Trên máy Windows, trong folder d:\Elearning
git init
git add .
git commit -m "Initial commit - H-T.Study eLearning Platform"
git remote add origin https://github.com/<username>/htstudy.git
git push -u origin main
```

### 6b. Tạo file .env:
```bash
cd /opt/htstudy
cat > .env << 'EOF'
DB_PASSWORD=HtStudy2026SecurePass!
REDIS_PASSWORD=RedisSecure2026!
RABBITMQ_PASSWORD=RabbitSecure2026!
MINIO_ACCESS_KEY=htstudy_minio
MINIO_SECRET_KEY=MinioSecure2026Pass!
EOF
```

### 6c. Tạo file .env.production cho API:
```bash
cat > apps/api/.env.production << 'EOF'
PORT=3001
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=htstudy
DB_PASSWORD=HtStudy2026SecurePass!
DB_DATABASE=htstudy
DB_LOGGING=false
JWT_SECRET=thay-bang-random-string-64-ky-tu-cua-ban
JWT_EXPIRES_IN=60m
REDIS_HOST=redis
REDIS_PORT=6379
ELASTICSEARCH_NODE=http://elasticsearch:9200
RABBITMQ_URL=amqp://htstudy:RabbitSecure2026!@rabbitmq:5672
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=htstudy_minio
MINIO_SECRET_KEY=MinioSecure2026Pass!
MINIO_BUCKET=htstudy-files
CORS_ORIGINS=https://htstudy.uk,https://www.htstudy.uk
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4o
EOF
```

### 6d. Start services:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Lần đầu sẽ mất 5-10 phút (download images + build).

### 6e. Kiểm tra:
```bash
# Xem containers đang chạy
docker compose -f docker-compose.prod.yml ps

# Test API
curl http://localhost:3001/api/v1/health
```

Kết quả mong đợi:
```json
{"success":true,"data":{"status":"ok","timestamp":"...","version":"1.0.0"}}
```

## Bước 7: Cài Nginx (reverse proxy)

```bash
sudo apt install nginx -y
```

Tạo config:
```bash
sudo tee /etc/nginx/sites-available/htstudy.uk << 'EOF'
server {
    listen 80;
    server_name htstudy.uk www.htstudy.uk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        client_max_body_size 100M;
    }
}
EOF
```

Kích hoạt:
```bash
sudo ln -s /etc/nginx/sites-available/htstudy.uk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Bước 8: Trỏ DNS trên Cloudflare

1. Vào **Cloudflare Dashboard** → chọn `htstudy.uk`
2. Tab **DNS** → Add record:

| Type | Name | Content | Proxy status |
|------|------|---------|-------------|
| A | `@` | `<IP server Oracle>` | Proxied (☁️ cam) |
| A | `www` | `<IP server Oracle>` | Proxied (☁️ cam) |

3. Tab **SSL/TLS** → chọn mode: **Flexible**
   (vì server chỉ listen port 80, Cloudflare sẽ xử lý HTTPS phía trước)

## Bước 9: Test website

Mở trình duyệt → truy cập:

**https://htstudy.uk**

Nếu thấy trang H-T.Study → ✅ **THÀNH CÔNG!**

Nếu thấy trang login → hoàn hảo!

---

## Tóm tắt toàn bộ

```
Cloudflare (DNS + CDN + SSL miễn phí)
         │
         │ HTTPS
         ▼
Oracle Cloud Server (miễn phí)
    ┌────┴────┐
    ▼         ▼
  Nginx     Nginx
  (port 80)
    │         │
    ▼         ▼
 Frontend   Backend API
 (React)    (NestJS)
 :3000      :3001
              │
        ┌─────┼─────┐
        ▼     ▼     ▼
     Postgres Redis  RabbitMQ
     (Docker containers)
```

Chi phí: **$5.30/năm** (chỉ tiền domain)

---

## Xử lý sự cố thường gặp

| Vấn đề | Giải pháp |
|--------|-----------|
| Trang trắng / 502 | `docker compose -f docker-compose.prod.yml logs api` xem lỗi |
| Không truy cập được | Kiểm tra: Security List đã mở port 80? iptables đã mở? |
| "Out of capacity" khi tạo VM | Thử AD khác, giảm OCPU/RAM, hoặc đợi thử lại |
| Docker build fail trên ARM | Đảm bảo dùng multi-platform images hoặc build trên ARM |
| Cloudflare 522 error | Server không response → check nginx đang chạy, ports mở |
| DNS chưa propagate | Đợi 5-10 phút sau khi thêm record |

---

## Bonus: Auto-start khi server reboot

```bash
# Đảm bảo Docker tự start
sudo systemctl enable docker

# Tạo service để auto-start containers
sudo tee /etc/systemd/system/htstudy.service << 'EOF'
[Unit]
Description=H-T.Study Docker Services
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/htstudy
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable htstudy
```

Giờ server reboot sẽ tự khởi động lại tất cả services.
