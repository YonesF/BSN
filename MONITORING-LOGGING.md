# LuksusEiendom - Monitoring & Logging Setup

## ?? Monitoring Services (Free/Affordable)

### 1. Uptime Monitoring
**Recommended: UptimeRobot (Free)**
- URL: https://uptimerobot.com/
- Setup: Monitor `https://www.luksuseiendom.no` every 5 minutes
- Alert: Email + SMS when site is down
- Status page: Create public status page

**Alternative: Pingdom (Trial/Paid)**
- More detailed reports
- Performance monitoring

### 2. SSL Certificate Monitoring
**SSL Labs Monitor (Free)**
- URL: https://www.ssllabs.com/ssltest/
- Weekly scans of your SSL configuration
- Email alerts for issues

**Alternative: Certificate Expiry Reminder**
```bash
# Add to crontab to check SSL expiry
0 0 * * 0 certbot certificates | mail -s "SSL Certificate Status" LuksusEiendom@hotmail.com
```

### 3. Security Monitoring
**Sucuri SiteCheck (Free)**
- URL: https://sitecheck.sucuri.net/
- Weekly malware scans
- Blacklist monitoring

### 4. Performance Monitoring
**Google PageSpeed Insights**
- URL: https://pagespeed.web.dev/
- Test weekly
- Target score: 90+

**WebPageTest**
- URL: https://www.webpagetest.org/
- Test from multiple locations
- Waterfall analysis

## ?? Server Logs to Monitor

### Apache Access Log
```bash
# Location: /var/log/apache2/access.log
# Monitor for:
# - Unusual traffic patterns
# - 404 errors
# - Suspicious user agents
# - Failed requests

# Example: Find most common 404s
grep "404" /var/log/apache2/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10
```

### Apache Error Log
```bash
# Location: /var/log/apache2/error.log
# Monitor for:
# - PHP errors (if you add PHP)
# - Module errors
# - Permission issues

# Example: Last 20 errors
tail -20 /var/log/apache2/error.log
```

### CSP Violation Reports (Advanced)
Add to your CSP header:
```
report-uri https://your-csp-report-endpoint.com/report
```

## ?? Alerts to Configure

### Critical Alerts (Immediate)
- [ ] Site down > 5 minutes
- [ ] SSL certificate expires in < 7 days
- [ ] Disk space > 90%
- [ ] Multiple failed login attempts (if you add login)
- [ ] Malware detected

### Warning Alerts (Daily Digest)
- [ ] SSL certificate expires in < 30 days
- [ ] Disk space > 80%
- [ ] Unusual traffic spike (>500% increase)
- [ ] High error rate (>5% of requests)
- [ ] Page load time > 3 seconds

### Info Alerts (Weekly Digest)
- [ ] Backup summary
- [ ] Traffic summary
- [ ] Top pages visited
- [ ] Top referrers
- [ ] Browser statistics

## ?? Analytics Setup

### Google Analytics 4 (Recommended)
Add to `<head>` in index.html:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    anonymize_ip: true,  // GDPR compliance
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

**Update CSP to allow Google Analytics:**
```
script-src 'self' https://cdn.tailwindcss.com https://www.googletagmanager.com https://www.google-analytics.com;
connect-src 'self' https://www.google-analytics.com https://analytics.google.com;
```

### Privacy-Friendly Alternative: Plausible Analytics
- URL: https://plausible.io/
- No cookies, GDPR compliant
- Lightweight (< 1KB)

## ?? Security Monitoring

### Fail2Ban (Server-Side)
```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure for Apache
sudo nano /etc/fail2ban/jail.local

[apache-auth]
enabled = true
maxretry = 3
findtime = 600
bantime = 3600
```

### Log Analysis Tools

**GoAccess (Real-time)**
```bash
# Install
sudo apt install goaccess

# Run
sudo goaccess /var/log/apache2/access.log -o /var/www/html/stats.html --log-format=COMBINED --real-time-html

# Access at: https://www.luksuseiendom.no/stats.html
# Protect with .htaccess!
```

**AWStats (Detailed)**
```bash
# Install
sudo apt install awstats

# Configure
sudo nano /etc/awstats/awstats.conf
```

## ?? Email Alert Setup

### Simple Bash Monitoring Script
```bash
#!/bin/bash
# monitor-site.sh

SITE="https://www.luksuseiendom.no"
EMAIL="LuksusEiendom@hotmail.com"

# Check if site is up
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $SITE)

if [ $HTTP_CODE != 200 ]; then
    echo "Website is down! HTTP Code: $HTTP_CODE" | mail -s "ALERT: LuksusEiendom Down" $EMAIL
fi

# Check SSL expiry
EXPIRY=$(echo | openssl s_client -servername www.luksuseiendom.no -connect www.luksuseiendom.no:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
    echo "SSL certificate expires in $DAYS_LEFT days!" | mail -s "WARNING: SSL Certificate Expiring" $EMAIL
fi
```

**Add to crontab:**
```bash
*/5 * * * * /path/to/monitor-site.sh
```

## ?? Mobile Monitoring

### Uptime Robot Mobile App
- iOS: https://apps.apple.com/app/uptime-robot/id1104878581
- Android: https://play.google.com/store/apps/details?id=com.uptimerobot

## ?? Monitoring Checklist

### Daily
- [ ] Check uptime alerts
- [ ] Review error log summary
- [ ] Check backup completion

### Weekly
- [ ] Review traffic patterns
- [ ] Run security scan (Sucuri)
- [ ] Check PageSpeed score
- [ ] Review 404 errors

### Monthly
- [ ] Full log analysis
- [ ] Security audit
- [ ] Performance review
- [ ] Test backup restoration
- [ ] Update monitoring tools

### Quarterly
- [ ] Review and update alert thresholds
- [ ] Test disaster recovery
- [ ] Update documentation
- [ ] Audit all monitoring services

## ?? Incident Response

When alert triggers:
1. **Acknowledge** alert within 15 minutes
2. **Assess** severity (Critical/High/Medium/Low)
3. **Investigate** root cause
4. **Mitigate** immediate issue
5. **Resolve** underlying problem
6. **Document** incident and resolution
7. **Review** to prevent recurrence

## ?? Monitoring Log Template

| Date | Time | Type | Issue | Resolution | Duration |
|------|------|------|-------|------------|----------|
| 2024-01-01 | 14:30 | Down | Server restart | Contacted host | 8 min |

---

**Setup Status:** ?? Not configured  
**Target Date:** Before launch  
**Responsible:** [Your name]
