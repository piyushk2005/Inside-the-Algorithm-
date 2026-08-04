# Inside the Algorithm — Landing Page

## What's in this zip
```
inside-the-algorithm/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx        (entry point)
│   ├── App.jsx          (renders Landing)
│   └── pages/
│       └── Landing.jsx  (the landing page component)
```

## How to replace files in your existing GitHub repo

1. **Unzip** this file somewhere on your machine.

2. **Clone your existing repo** (if you haven't already):
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

3. **Copy the files over**, replacing what's there. From inside the unzipped
   `inside-the-algorithm` folder:
   ```bash
   cp -r index.html package.json vite.config.js src /path/to/your-repo/
   ```
   If your repo already has its own `package.json` with other dependencies,
   don't overwrite it blindly — instead just merge in the `react`,
   `react-dom`, `vite`, and `@vitejs/plugin-react` entries, and copy only
   `src/pages/Landing.jsx`, `src/App.jsx`, and `src/main.jsx`.

4. **Commit and push**:
   ```bash
   cd /path/to/your-repo
   git add .
   git commit -m "Replace landing page with Inside the Algorithm design"
   git push origin main
   ```
   (use whatever branch name your repo uses instead of `main` if different)

5. **Install and run locally to check it** before pushing, if you want:
   ```bash
   npm install
   npm run dev
   ```
   Then open the local URL it prints (usually `http://localhost:5173`).

## Notes
- This is just the landing page (Page 1). The four module cards currently
  link to nothing — Module 1 (Gradient Descent) and the rest still need to
  be built and wired up with routing (e.g. React Router) once you're ready.
- Fonts (Inter, JetBrains Mono) load from Google Fonts via a `<link>` tag
  inside `Landing.jsx` — no extra setup needed.
