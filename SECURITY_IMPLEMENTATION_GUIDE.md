# 🚀 Przewodnik Implementacji Zabezpieczeń

**Quick Start Guide** dla wdrożenia zaleceń z **SECURITY_AUDIT_REPORT.md**

---

## ✅ Co Zostało Przygotowane

W tym Pull Request zostały stworzone następujące pliki:

1. **`SECURITY_AUDIT_REPORT.md`** - Kompleksowy raport audytu bezpieczeństwa
2. **`SECURITY_VERIFICATION_REPORT.md`** - Raport weryfikacji z odpowiedziami na pytania
3. **`public/_headers`** - Gotowe security headers dla Netlify ✅
4. **`netlify.toml`** - Konfiguracja HTTPS redirects ✅
5. **`.github/dependabot.yml`** - Automatyczne dependency updates ✅
6. **Ten przewodnik** - Instrukcje wdrożenia

---

## 🔴 Priorytet 1: KRYTYCZNE (30min - 2h)

### **Krok 1: Zamień index.html na index-optimized.html**

**Problem:** `index.html` używa Google Fonts (naruszenie CSP + GDPR)

**Rozwiązanie:**
```bash
# Backup obecnego pliku
mv index.html index-google-fonts-backup.html

# Użyj zoptymalizowanej wersji
mv index-optimized.html index.html

# Verify
grep -i "google" index.html
# Expected: NO MATCHES ✅
```

**Test:**
```bash
pnpm dev
# Open http://localhost:5173
# DevTools → Network → Filter "font"
# Verify fonts load from /fonts/ (not googleapis.com)
```

---

### **Krok 2: Weryfikuj pliki security**

**Sprawdź czy pliki zostały stworzone:**
```bash
ls -la public/_headers        # ✅ Powinien istnieć
ls -la netlify.toml           # ✅ Powinien istnieć
ls -la .github/dependabot.yml # ✅ Powinien istnieć
```

**Podejrzyj zawartość:**
```bash
cat public/_headers
# Expected: Content-Security-Policy, X-Frame-Options, etc.

cat netlify.toml
# Expected: HTTPS redirects + SPA fallback
```

---

### **Krok 3: Deploy i test**

**Build lokalnie:**
```bash
pnpm build
pnpm preview

# Open http://localhost:4173
# DevTools → Console: sprawdź brak błędów CSP
```

**Deploy na Netlify:**
```bash
# Commit changes (see next section)
git add .
git commit -m "feat: implement security headers and CSP (P0)"
git push origin <branch-name>

# Netlify auto-deploys
# Wait 2-3 minutes for deployment
```

**Weryfikacja po deployment:**

1. **Test Security Headers:**
```bash
curl -I https://adamski.tech | grep -iE "content-security|x-frame|strict-transport"

# Expected output:
# Content-Security-Policy: default-src 'self'; ...
# X-Frame-Options: DENY
# Strict-Transport-Security: max-age=31536000; ...
```

2. **Online Security Check:**
```
https://securityheaders.com/?q=adamski.tech
# Expected grade: A or A+
```

3. **Test HTTPS Redirect:**
```bash
curl -I http://adamski.tech

# Expected:
# HTTP/1.1 301 Moved Permanently
# Location: https://adamski.tech/
```

4. **Test CSP (manual):**
- Open https://adamski.tech
- DevTools → Console
- Paste: `document.body.innerHTML = '<img src=x onerror="alert(\'XSS\')">'`
- **Expected:** CSP error (script blocked) ✅

---

## 🟠 Priorytet 2: WYSOKIE (1-2h)

### **Krok 4: Dependency Audit**

**Run security audit:**
```bash
npm audit

# Check for vulnerabilities
# Expected: Report of high/critical issues
```

**Fix vulnerabilities:**
```bash
# Automatic fix
npm audit fix

# If breaking changes needed:
npm audit fix --force

# Verify
npm audit
# Expected: 0 high/critical vulnerabilities
```

**Commit fix:**
```bash
git add package.json package-lock.json
git commit -m "security: fix npm audit vulnerabilities"
```

---

### **Krok 5: Input Validation (opcjonalne, ale zalecane)**

**Install DOMPurify:**
```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

**Edit `src/App.tsx`:**

Znajdź formularz kontaktowy (~line 1006-1016) i dodaj walidację:

```typescript
import DOMPurify from 'dompurify';

// W onSubmit handler:
const name = DOMPurify.sanitize(String(fd.get('name') || '').trim());
const email = DOMPurify.sanitize(String(fd.get('email') || '').trim());
const message = DOMPurify.sanitize(String(fd.get('message') || '').trim());

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  alert('Nieprawidłowy adres email');
  return;
}

// Length limits
if (name.length > 100 || message.length > 5000) {
  alert('Input zbyt długi');
  return;
}

// Continue with mailto...
```

**Test:**
```bash
pnpm dev
# Test formularz z długim inputem
# Test z nieprawidłowym emailem
```

---

## 🟢 Opcjonalne: Monitoring (2-3h)

### **Krok 6: Sentry Setup (error tracking)**

**Install Sentry:**
```bash
pnpm add @sentry/react @sentry/vite-plugin
```

**Configure `vite.config.ts`:**
```typescript
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "your-org",
      project: "adamski-tech",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })
  ]
});
```

**Configure `src/main.tsx`:**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

**More:** Zobacz SECURITY_AUDIT_REPORT.md → P2-3

---

## 📊 Metryki Sukcesu

Po wdrożeniu P0 + P1 oczekuj:

| Metric | Przed | Po | Tool |
|--------|-------|-----|------|
| **Security Headers Grade** | F | A | securityheaders.com |
| **CSP Coverage** | 0% | 95% | csp-evaluator.withgoogle.com |
| **npm audit (high/critical)** | ? | 0 | `npm audit` |
| **HTTPS Enforcement** | Partial | Full | `curl -I http://adamski.tech` |
| **Security Score** | 42/100 | 92/100 | SECURITY_AUDIT_REPORT.md |

---

## ✅ Checklist Finalizacyjny

### **Pre-deployment:**
- [ ] `index.html` zamieniony na `index-optimized.html`
- [ ] `public/_headers` istnieje i jest poprawny
- [ ] `netlify.toml` istnieje i jest poprawny
- [ ] `.github/dependabot.yml` istnieje
- [ ] `npm audit` wykazuje 0 high/critical
- [ ] Build lokalny działa: `pnpm build && pnpm preview`
- [ ] Brak błędów CSP w DevTools Console

### **Post-deployment:**
- [ ] `curl -I https://adamski.tech` pokazuje security headers
- [ ] securityheaders.com wykazuje grade A
- [ ] HTTP → HTTPS redirect działa
- [ ] Fonty ładują się z /fonts/ (nie googleapis.com)
- [ ] CSP blokuje próby XSS (test w DevTools)
- [ ] Dependabot działa (check GitHub → Insights → Dependency graph)

---

## 🆘 Troubleshooting

### **Problem: CSP blokuje zasoby**

**Symptom:** DevTools Console pokazuje błędy CSP:
```
Refused to load the script 'https://example.com/script.js' because it violates the following Content Security Policy directive...
```

**Rozwiązanie:**
1. Sprawdź czy zasób jest niezbędny
2. Jeśli TAK: dodaj domenę do odpowiedniej dyrektywy CSP w `public/_headers`
   ```nginx
   # Example: dodaj cdn.example.com do script-src
   Content-Security-Policy: ... script-src 'self' https://cdn.example.com; ...
   ```
3. Jeśli NIE: usuń zasób z kodu

---

### **Problem: Netlify nie czyta _headers**

**Symptom:** `curl -I https://adamski.tech` nie pokazuje custom headers

**Rozwiązanie:**
1. Sprawdź czy plik jest w `public/_headers` (nie `src/_headers`)
2. Sprawdź czy build command kopiuje `public/` do `dist/`:
   ```bash
   ls -la dist/_headers
   # Expected: file exists
   ```
3. Redeploy: Netlify → Deploys → Trigger deploy → Clear cache and deploy

---

### **Problem: Tailwind CSS nie działa po CSP**

**Symptom:** Strona wygląda źle (brak styli)

**Rozwiązanie:**
- Tailwind **WYMAGA** `'unsafe-inline'` dla `style-src`
- Sprawdź CSP w `public/_headers`:
  ```nginx
  style-src 'self' 'unsafe-inline';
  ```
- To jest **normalne** i **akceptowalne** dla Tailwind

---

## 📚 Dodatkowe Zasoby

- **Główny raport:** `SECURITY_AUDIT_REPORT.md`
- **Raport weryfikacji:** `SECURITY_VERIFICATION_REPORT.md`
- **CSP Reference:** https://content-security-policy.com/
- **Security Headers Validator:** https://securityheaders.com/
- **Mozilla Observatory:** https://observatory.mozilla.org/

---

## 📞 Kontakt

Dla pytań technicznych:
- **Repository:** github.com/RudyKotJeKoc/Adamski.tech
- **Branch:** `claude/verify-security-audit-implementation-014Tiop3wLh9AhuFLrhdCwLC`

---

**Good luck! 🚀**

Implementacja P0+P1 zajmie ~2-3h i zwiększy Security Score z **42/100** do **92/100** (+50 punktów).
