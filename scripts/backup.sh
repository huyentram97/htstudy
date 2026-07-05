#!/bin/bash
# H-T.Study - Daily Backup Script
# Schedule: crontab -e → 0 2 * * * /opt/htstudy/scripts/backup.sh

set -e

BACKUP_DIR="/opt/backups/htstudy"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p $BACKUP_DIR

echo "[$(date)] Starting backup..."

# 1. Backup PostgreSQL database
echo "  Backing up database..."
docker exec htstudy-postgres pg_dump -U htstudy htstudy | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# 2. Backup system config (optional)
echo "  Backing up config..."
cp /opt/htstudy/apps/api/.env.production $BACKUP_DIR/env_$DATE.bak 2>/dev/null || true

# 3. Cleanup old backups
echo "  Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "env_*.bak" -mtime +$RETENTION_DAYS -delete

# 4. Report
BACKUP_SIZE=$(du -sh $BACKUP_DIR/db_$DATE.sql.gz | cut -f1)
echo "[$(date)] Backup completed: db_$DATE.sql.gz ($BACKUP_SIZE)"
echo "  Total backups: $(ls $BACKUP_DIR/db_*.sql.gz 2>/dev/null | wc -l)"
