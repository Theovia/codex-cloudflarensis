# Codex Cloudflarensis · Trilogía Iluminada

Manuscrito digital griego-renacentista sobre el stack Cloudflare. Tres volúmenes: **Primitivas · Arquitectura · Operación**.

🌐 **Live**: [codex.eigenatlas.com](https://codex.eigenatlas.com)
🔁 **Backup**: [codex-cloudflarensis.pages.dev](https://codex-cloudflarensis.pages.dev)

## Estructura

| File | Volumen | Contenido |
|------|---------|-----------|
| `index.html` | Bibliotheca | Landing con 3 volúmenes |
| `volumen-i.html` | De Primitivis | 24 primitivas + graph cosmográfico |
| `volumen-ii.html` | De Architectura | 8 patterns + 7 theorems + 3 reference systems + decision tree + 7 sins |
| `volumen-iii.html` | De Operationibus | failure modes + cost models + observability + migrations + perf limits |

## Stack

- **Tipografía**: Cinzel Decorative + Cinzel + Cormorant Garamond + EB Garamond + UnifrakturMaguntia
- **Paleta**: pigmentos medievales auténticos (lapislázuli, vermillón, verdigris, oro, pergamino)
- **Animaciones**: GSAP + ScrollTrigger
- **Hosting**: Cloudflare Pages (recursio dignified — el codex de CF servido por CF)

## Deploy

```bash
wrangler pages deploy . --project-name=codex-cloudflarensis --commit-dirty=true --branch=main
```

CF Pages también soporta git integration — push a `main` deploya automático.

## Custom domain

Configurado vía API:

```bash
# 1. Attach domain
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/pages/projects/codex-cloudflarensis/domains" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"codex.eigenatlas.com"}'

# 2. CNAME en zona
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"CNAME","name":"codex","content":"codex-cloudflarensis.pages.dev","proxied":true}'
```

## Licencia

CC BY-NC-SA 4.0 — Compártase libremente con atribución, no comercial.

---

*Codex compositus · Anno Domini MMXXVI · In nomine Cloudflarensis · Ad maiorem architecturae gloriam*
