Plan wdrożenia – Adamski.tech (Nginx / Netlify) z redirectami i SPA

Cel
- Hostowanie strony (landing + SPA) z obsługą tras /qr/biz oraz /hans, z UTM, SEO i i18n.
- Zapewnienie szybkiego, bezpiecznego dostępu (HTTPS), cache statycznych, oraz prostych redirectów dla A/B i batch tracking.

Opcja 1: Nginx (Synology lub własny VPS)
1) Pakiety i certyfikaty (Ubuntu/Debian)
   sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
2) Certbot – HTTPS dla adamski.tech i www.adamski.tech
   sudo certbot --nginx -d adamski.tech -d www.adamski.tech --redirect
   # automatyczny 301 HTTP→HTTPS, odnowienia w cron/systemd
3) Konfiguracja Nginx (server block)
/etc/nginx/sites-available/adamski.tech:
------------------------------------------------
server {
    listen 80;
    server_name adamski.tech www.adamski.tech;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name adamski.tech www.adamski.tech;

    # Certyfikaty – wstawione przez certbot
    ssl_certificate /etc/letsencrypt/live/adamski.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/adamski.tech/privkey.pem;

    # Gzip i kompresja
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Root i SPA
    root /var/www/adamski.tech;
    index index.html;

    # Cache statyków
    location ~* \.(?:js|css|svg|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
    location ~* \.(?:png|jpg|jpeg|webp|avif)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Redirecty dla materiałów drukowanych (A/B, batchy)
    location /qr/biz {
        return 302 https://adamski.tech/hub?via=card_qr&v=v1;
    }
    location /hans {
        return 302 https://adamski.tech/partners/hans?via=nfc&v=v1;
    }
}
------------------------------------------------
4) Wdrożenie builda
   # załóżmy build w /workspace/project_adamski_tech/dist/
   sudo mkdir -p /var/www/adamski.tech
   sudo rsync -av --delete /workspace/project_adamski_tech/dist/ /var/www/adamski.tech/
   # sprawdź uprawnienia: www-data:www-data

5) vCard
   # upewnij się, że /public/vcard.vcf istnieje w buildzie
   # źródło: /workspace/project_adamski_tech/assets/vcard/vcard.vcf
   # w Vite: public/ pliki kopiują się automatycznie do dist/

6) UTM i analityka
   - UTM przekazywane przez SPA; rozważ lekkie analytics (Plausible/Umami).
   - A/B i batch tracking: via param v= oraz via=; utrzymywać osobne linki dla QR i NFC.

Opcja 2: Netlify (prosta i szybka)
1) Build/publish
   - Build command: npm run build
   - Publish directory: /workspace/project_adamski_tech/dist (lokalnie), w Netlify – ustaw output „dist”
2) Redirecty SPA
   - Plik: /workspace/project_adamski_tech/public/_redirects
     /*    /index.html   200
3) Dodatkowe redirecty (Netlify _redirects – alternatywa do Nginx)
   /qr/biz   https://adamski.tech/hub?via=card_qr&v=v1   302
   /hans     https://adamski.tech/partners/hans?via=nfc&v=v1   302
4) DNS
   - Jeśli Netlify: skonfiguruj rekordy CNAME dla adamski.tech → Netlify
   - Jeśli VPS/Nginx: ustaw A/AAAA na adres serwera (IPv4/IPv6)
5) i18n
   - Dodaj hreflang w head lub meta dynamicznie dla tras (PL/EN/NL)
   - W SPA: przełącznik języka; Meta title/description: generowane runtime z content.json

Checklist wdrożeniowy
- SPA działa dla /qr/biz i /hans (fallback try_files/index.html lub _redirects)
- vCard dostępny pod /vcard.vcf
- Redirecty A/B działają (302); UTM się zachowują
- HTTPS i gzip włączone
- Cache statyczny ustawiony (js/css/svg/woff2, obrazy)
- DNS poprawnie wskazuje hosting
- Analytics (np. Plausible) wdrożony lekko, bez śledzenia osobowego

Uwagi
- Po potwierdzeniu numeru telefonu: przegenerować QR vCard (100%K, margin ≥ 4 moduły)
- W przypadku Synology: użyj wbudowanego Reverse Proxy + Let’s Encrypt; ustaw SPA fallback (Rewrite URL → /index.html)
- Pamiętaj o batch ID (np. adamski_card_v1) przy spadzie – niewidoczne po cięciu