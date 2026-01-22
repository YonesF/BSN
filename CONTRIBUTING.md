# Contributing to LuksusEiendom

## Security Standards

All code contributions must follow these security practices to protect users and maintain site integrity.

### 1. XSS Protection (Cross-Site Scripting)

XSS occurs when user content is interpreted as HTML/JS.

**Rules:**
- ? **DO**: Use `textContent` or `createElement()` for user data
  ```javascript
  el.textContent = userInput; // Safe
  ```
- ? **DON'T**: Use `innerHTML` with user data
  ```javascript
  el.innerHTML = userInput; // Dangerous - can inject <script>
  ```
- If HTML formatting is required: sanitize on server or use a vetted library
- **Best practice**: Avoid HTML insertion entirely when possible

### 2. Content Security Policy (CSP)

Implement CSP in `<head>` to prevent malicious script execution even if XSS occurs.

**Requirements:**
- Avoid inline scripts (`<script>...</script>`)
- Avoid inline event handlers (`onclick="..."`)
- Move all JavaScript to external files

**Baseline CSP:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'">
```

**Current Implementation:**
Our CSP allows Tailwind CDN and Google Fonts. For production, consider using Tailwind CLI to eliminate CDN dependency and strengthen CSP.

### 3. Input Validation

**Front-end validation:**
- Validate length, format (email/phone), allowed characters
- Use HTML5 validation: `type="email"`, `pattern`, `minlength`, `maxlength`
- In JavaScript: check and reject/normalize input
- **Important**: Front-end validation is NOT a security measure alone - always validate server-side

**Example from slider.js:**
```javascript
function sanitizeSliderValue(value) {
    if (typeof value !== 'string' && typeof value !== 'number') return 50;
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || !isFinite(numValue)) return 50;
    return Math.max(0, Math.min(100, numValue));
}
```

### 4. Secure External Links (Tabnabbing Protection)

All links with `target="_blank"` must include security attributes:

```html
<a href="..." target="_blank" rel="noopener noreferrer">...</a>
```

**Why:**
- `noopener`: Prevents the new page from accessing `window.opener`
- `noreferrer`: Prevents the browser from sending referrer information

### 5. Cookie & Session Security

If implementing user login:
- Cookies must be: `HttpOnly`, `Secure`, `SameSite`
- Avoid storing tokens in `localStorage` (vulnerable to XSS)
- Minimize token handling in client-side JavaScript

### 6. HTTPS & Mixed Content

**Requirements:**
- All resources must load over HTTPS (images, scripts, fonts)
- Never mix HTTP and HTTPS resources
- Configure HSTS header on server after SSL is installed

### 7. Clickjacking Protection

Prevent the site from being embedded in malicious iframes:
- Use CSP: `frame-ancestors 'none'`
- Server-side: `X-Frame-Options: DENY`

### 8. Dangerous Functions - Never Use

? **Prohibited:**
- `eval(...)`
- `new Function(...)`
- `location = userInput` (without validation)
- User input directly in `innerHTML`, `srcdoc`, `href` without validation
- `document.write()`
- `setTimeout`/`setInterval` with string arguments

### 9. Dependency Management

**Requirements:**
- Keep all libraries updated
- Never use random `min.js` files from untrusted sources
- Verify CDN integrity with SRI (Subresource Integrity) when possible:
  ```html
  <script src="https://cdn.example.com/library.js" 
          integrity="sha384-hash..." 
          crossorigin="anonymous"></script>
  ```
- **Note**: Tailwind CDN doesn't support SRI. Use Tailwind CLI for production.

### 10. Error Handling

**Secure error handling:**
- Never expose sensitive information in error messages
- Log errors server-side, show generic messages to users
- Implement fallback behavior for failed resources

**Example from slider.js:**
```javascript
if (errorCount === 1) {
    // Try fallback
    this.src = 'fallback-image.jpg';
} else if (errorCount === 2) {
    // Hide gracefully
    this.style.display = 'none';
    console.error('Failed to load image');
}
```

### 11. Server Security Headers

Configure these on your web server (see `.htaccess` or SECURITY-DEPLOYMENT.md):

**Required:**
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

**After SSL installation:**
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## Code Review Checklist

Before submitting:
- [ ] No `innerHTML` with user data
- [ ] CSP meta tag present and configured
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] Input validation implemented
- [ ] No inline scripts or event handlers
- [ ] All resources load via HTTPS
- [ ] No usage of `eval`, `new Function`, or `document.write`
- [ ] Dependencies are from trusted sources
- [ ] Error handling doesn't expose sensitive info
- [ ] Console.log removed from production code
- [ ] Tested with security tools (Observatory, Security Headers)

## Production Deployment Checklist

Additional checks before going live:
- [ ] SSL certificate installed and tested
- [ ] HTTPS redirect enabled
- [ ] Server security headers configured
- [ ] Backups configured
- [ ] Security scans completed (see SECURITY-DEPLOYMENT.md)
- [ ] Remove development/debug code
- [ ] Test all functionality with strict CSP

## Testing Your Changes

### Local Testing
```bash
# Test with a local server (don't just open index.html)
python -m http.server 8000
# or
npx serve
```

### Security Testing Tools
Run these before submitting:
1. [Mozilla Observatory](https://observatory.mozilla.org/)
2. [Security Headers](https://securityheaders.com/)
3. [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## Reporting Security Issues

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Contact us directly at: [security contact email]
3. Provide detailed information about the vulnerability
4. Wait for confirmation before public disclosure

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## Security Updates

This document is maintained alongside our security implementation. Last updated: 2024