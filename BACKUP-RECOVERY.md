# LuksusEiendom - Backup & Recovery Plan

## ?? Backup Strategy

### What to Backup
- [ ] All HTML/CSS/JS files
- [ ] Images (54603800-d5a2-4466-b8e1-9880f1748d86.jpg, Demo_1_after.png, Add.mov)
- [ ] Configuration files (.htaccess, robots.txt, security.txt)
- [ ] Server logs (weekly)

### Backup Frequency
- **Daily**: Automated backup of all website files
- **Weekly**: Full backup including logs
- **Monthly**: Archival backup (keep for 1 year)

### Backup Locations
1. **Primary**: Server backup (hosting provider)
2. **Secondary**: Cloud storage (Google Drive, Dropbox, or OneDrive)
3. **Tertiary**: Local backup (external hard drive)

### Automated Backup Script (Bash)
```bash
#!/bin/bash
# backup-luksuseiendom.sh

BACKUP_DIR="/backup/luksuseiendom"
SITE_DIR="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$SITE_DIR" .

# Keep only last 30 days
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +30 -delete

# Upload to cloud (example with rclone)
# rclone copy "$BACKUP_DIR/backup_$DATE.tar.gz" remote:luksuseiendom-backups/
```

### Cron Job Setup
```bash
# Add to crontab: crontab -e
0 2 * * * /path/to/backup-luksuseiendom.sh
```

## ?? Disaster Recovery

### Recovery Time Objective (RTO): 4 hours
### Recovery Point Objective (RPO): 24 hours

### Recovery Steps
1. Identify issue and take site offline if necessary
2. Locate most recent valid backup
3. Extract backup files
4. Restore to server
5. Verify all files and functionality
6. Update DNS if server changed
7. Test thoroughly before going live
8. Monitor for 24 hours

### Emergency Contacts
- Hosting Provider: [contact]
- Domain Registrar: [contact]
- Technical Support: [your contact]

## ?? Pre-Launch Checklist

### Files to Backup Before Launch
```
? index.html (or Index.html)
? styles.css
? slider.js
? .htaccess
? robots.txt
? .well-known/security.txt
? 404.html
? 500.html
? 54603800-d5a2-4466-b8e1-9880f1748d86.jpg
? Demo_1_after.png
? Add.mov
```

### Verify Backup Integrity
```bash
# Test backup restoration monthly
cd /tmp
tar -xzf /backup/luksuseiendom/backup_latest.tar.gz
diff -r /tmp/extracted/ /var/www/html/
```

## ?? Monitoring

### What to Monitor
- Server uptime (use UptimeRobot or similar)
- SSL certificate expiration
- Disk space usage
- Bandwidth usage
- Failed login attempts
- Error log size

### Alerts to Set Up
- Site down for > 5 minutes
- SSL certificate expires in < 30 days
- Disk usage > 80%
- Unusual traffic patterns

## ?? Security Backup

### Separate Security Logs
```bash
# Archive security-sensitive logs separately
/var/log/apache2/access.log
/var/log/apache2/error.log
/var/log/fail2ban.log (if installed)
```

### Encrypted Backups
For sensitive data, use encrypted backups:
```bash
tar -czf - /var/www/html | gpg --symmetric --cipher-algo AES256 > backup_encrypted.tar.gz.gpg
```

## ?? Backup Log Template

| Date | Type | Size | Location | Verified | Notes |
|------|------|------|----------|----------|-------|
| 2024-01-01 | Full | 50MB | Cloud | ? | Initial backup |
| 2024-01-02 | Daily | 48MB | Cloud | ? | Updated images |

## Testing Recovery

**Test restoration quarterly:**
1. Select random backup
2. Restore to test environment
3. Verify all functionality
4. Document any issues
5. Update recovery procedures

---

**Last Updated:** 2024  
**Review Frequency:** Quarterly  
**Next Review:** [Date]
