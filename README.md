# LuksusEiendom - Moderne Luksus-boligannonser

Premium boligannonser for eiendomsmeglere på Sørlandet.

## ?? Quick Start

### Local Development
```bash
# Start a local web server (required for security policies to work)
python -m http.server 8000
# or
npx serve

# Open browser
http://localhost:8000
```

### File Structure
```
LuksusEiendom/
??? Index.html              # Main HTML file
??? styles.css              # Custom styles
??? slider.js               # Before/after slider functionality
??? .htaccess              # Apache security headers
??? CONTRIBUTING.md        # Security standards & guidelines
??? SECURITY-DEPLOYMENT.md # Deployment checklist
??? README.md              # This file
```

## ?? Security

This project implements industry-standard security practices:

- ? Content Security Policy (CSP)
- ? No inline scripts or event handlers
- ? Safe DOM manipulation (no innerHTML with user data)
- ? Input validation and sanitization
- ? Secure external links (noopener noreferrer)
- ? HTTPS-only resources
- ? Clickjacking protection

**For developers:** See [CONTRIBUTING.md](CONTRIBUTING.md) for security standards.

**For deployment:** See [SECURITY-DEPLOYMENT.md](SECURITY-DEPLOYMENT.md) for server configuration.

## ?? Dependencies

### External Resources
- **Tailwind CSS**: https://cdn.tailwindcss.com (CDN)
- **Google Fonts**: Inter & Playfair Display
- **Images**: Unsplash (fallback), local files (primary)

### Production Recommendation
For maximum security, replace Tailwind CDN with Tailwind CLI:

```bash
npm install -D tailwindcss
npx tailwindcss -o tailwind.css --minify
```

Then update `Index.html`:
```html
<!-- Replace -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- With -->
<link rel="stylesheet" href="tailwind.css">
```

## ?? Testing

### Before Deployment
Run security scans:
1. **Mozilla Observatory**: https://observatory.mozilla.org/
2. **Security Headers**: https://securityheaders.com/
3. **SSL Labs** (after SSL): https://www.ssllabs.com/ssltest/

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## ?? Deployment

### Prerequisites
1. SSL certificate installed
2. Web server configured (Apache/Nginx)
3. Security headers enabled (see `.htaccess`)

### Steps
1. Upload all files to web root
2. Ensure `.htaccess` is uploaded (Apache) or configure Nginx
3. Enable HTTPS redirect
4. Test with security tools (see above)
5. Monitor for errors

See [SECURITY-DEPLOYMENT.md](SECURITY-DEPLOYMENT.md) for detailed checklist.

## ?? Known Issues

None currently. Report issues via [contact form](https://forms.gle/J5DvMgTjGm1qPBv26).

## ?? License

© 2026 LuksusEiendom. All rights reserved.

## ?? Contact

- **Website**: [Your website URL]
- **Form**: https://forms.gle/J5DvMgTjGm1qPBv26
- **Security**: [security email]

---

**Note**: This is a production-ready implementation with security best practices. Do not remove or weaken security measures without understanding the implications.
