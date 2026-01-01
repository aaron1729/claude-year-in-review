# How to Package Year-in-Review for Others

## Quick Steps

When someone sends you their Claude export JSON files:

1. **Replace the data files**
   ```bash
   # Put their 4 JSON files into export-data/ folder, replacing the existing ones:
   # - conversations.json
   # - projects.json
   # - memories.json
   # - users.json
   ```

2. **Process their data**
   ```bash
   npx tsx scripts/process-export.ts export-data
   ```

3. **Build the static package**
   ```bash
   npm run build
   ```

4. **Package and send**
   ```bash
   # Create a zip file of the out/ directory
   cd out
   zip -r ../year-in-review.zip .
   cd ..

   # Send them year-in-review.zip
   ```

5. **They unzip and view**
   - They unzip the file
   - Double-click `OPEN-ME.command` (Mac/Linux) or `OPEN-ME.bat` (Windows)
   - Open browser to `http://localhost:8000`
   - That's it! No installation, completely private

## What's in the package

- `index.html` - The main page
- `data/processed.json` - Their aggregated stats (already processed)
- `_next/` - JavaScript, CSS, and other assets
- `README.txt` - Simple instructions for them
- `OPEN-ME.command` (Mac/Linux) - Double-click to start server
- `OPEN-ME.bat` (Windows) - Double-click to start server

## Important: They need a local web server

The exported app **cannot** be opened directly by double-clicking `index.html` due to how modern JavaScript works with file paths. Recipients have three easy options:

1. **Easiest**: Double-click the `OPEN-ME.command` (Mac/Linux) or `OPEN-ME.bat` (Windows) file
2. **Manual**: Open terminal in the folder and run `python3 -m http.server 8000`
3. **Alternative**: Use any simple HTTP server (npx serve, etc.)

Then open browser to `http://localhost:8000`

This is all explained in the README.txt file included in the package.

## Privacy

The package is completely self-contained and runs entirely in the browser via a local HTTP server. Their data never leaves their machine.
