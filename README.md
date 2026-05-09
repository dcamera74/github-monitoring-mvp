# GitHub Monitoring MVP

Dashboard Next.js per visualizzare repository AI (top/growth) con aggiornamento dati live da GitHub.

## Prerequisiti
- Node.js 20+
- npm

## Sviluppo locale
```bash
npm install
npm run dev
```

URL locale: `http://localhost:3000`

## Variabili ambiente
Creare un file `.env.local` partendo da `.env.example`:

```bash
cp .env.example .env.local
```

`GITHUB_TOKEN` è fortemente consigliato in produzione per usare API GitHub affidabili ed evitare fallback HTML.

## Deploy in produzione (Vercel)
1. Pubblica il repository su GitHub.
2. Su Vercel: **Add New Project** → importa il repository.
3. In **Project Settings → Environment Variables** aggiungi:
   - `GITHUB_TOKEN` = token GitHub valido
4. Deploy del branch `main` (auto-deploy attivo ai push successivi).

## Smoke test dopo deploy
Sostituisci `YOUR_URL` con il dominio Vercel:

```bash
curl -i https://YOUR_URL/
curl -i https://YOUR_URL/api/health
curl -i -X POST https://YOUR_URL/api/refresh-data
```

Atteso:
- `/` risponde 200
- `/api/health` risponde `{"status":"ok"}`
- `/api/refresh-data` risponde 200 (oppure 503 con messaggio esplicito in caso outage GitHub)

## Monitoraggio e incident response
- CI su GitHub Actions: `.github/workflows/ci.yml` (lint + build)
- Uptime check schedulato: `.github/workflows/uptime-check.yml`

In caso di incidente:
1. Controlla log su Vercel (Runtime/Functions).
2. Verifica validità/rate limit `GITHUB_TOKEN`.
3. Se necessario fai rollback in Vercel al deployment precedente stabile.

## Release flow consigliato
1. Apri PR.
2. Verifica CI verde.
3. Merge su `main`.
4. Vercel esegue deploy automatico.
