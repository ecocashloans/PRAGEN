# PRAGEN — PRAQEN Login Page (Node.js Clone)

Node.js (Express) clone of [https://praqen.com/login](https://praqen.com/login).

## Run locally

```bash
npm install
npm start
```

Open: http://localhost:3000/login

## What this includes

- Express server (`server.js`) serving the React SPA
- Same-origin `/api` proxy → `https://parqen-app.onrender.com/api` (avoids CORS)
- Full CRA static assets (main bundle + CSS + 40 lazy chunks + favicons)

## Push to GitHub

Remote is already configured:

```bash
git remote -v
# origin  https://github.com/ecocashloans/PRAGEN.git
```

Push with a Personal Access Token (classic: `repo` scope):

```bash
git push -u origin main
# Username: your-github-username
# Password: <paste PAT, not account password>
```

Or with token in the URL (one-shot):

```bash
git push https://<TOKEN>@github.com/ecocashloans/PRAGEN.git main
```

Optional API override:

```bash
PRAQEN_API_URL=https://parqen-app.onrender.com/api PORT=3000 npm start
```
