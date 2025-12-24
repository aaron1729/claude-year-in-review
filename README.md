# Claude Year in Review

A beautiful, interactive visualization of your year with Claude. Generate your own personalized year-in-review experience from your Claude conversation export.

## Features

- **10 Scrollytelling Sections**: Opening, temporal patterns, themes, tools, projects, creative moments, rhythm analysis, highlights, memories, and closing
- **Anthropic-Inspired Design**: Warm cream backgrounds, terra cotta accents, serif typography
- **Interactive Elements**: Click on highlights to see conversation details
- **Downloadable Share Cards**: Save PNG images of your stats to share on social media
- **Privacy-First**: All processing happens locally - your data never leaves your machine

## Quick Start

### 1. Export Your Claude Data

1. Go to [claude.ai/settings/data-privacy-controls](https://claude.ai/settings/data-privacy-controls)
2. Click **"Export Data"** at the bottom of the page
3. Wait for the email from Claude (usually takes a few minutes)
4. Download the zip file and unzip it - you'll have a folder with `conversations.json`, `projects.json`, `memories.json`, and `users.json`

### 2. Clone and Install

```bash
git clone https://github.com/SantaJordan/claude-year-in-review.git
cd claude-year-in-review
npm install
```

### 3. Process Your Data

Copy your exported files to the `export-data` folder:

```bash
# Create the folder if it doesn't exist
mkdir -p export-data

# Copy your exported files
cp /path/to/your/export/conversations.json export-data/
cp /path/to/your/export/projects.json export-data/
cp /path/to/your/export/memories.json export-data/
cp /path/to/your/export/users.json export-data/
```

Then run the processing script:

```bash
npx tsx scripts/process-export.ts export-data
```

This creates `public/data/processed.json` with your summarized stats.

### 4. View Your Year in Review

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Share Your Stats

Each section has a **Download Card** button that saves a PNG image you can share on Twitter, LinkedIn, or anywhere else!

## What Gets Analyzed

| Data | What We Extract |
|------|-----------------|
| **Conversations** | Total count, dates, message counts, themes |
| **Messages** | Human vs assistant counts, notable excerpts |
| **Tools** | Which tools were used, how often |
| **Projects** | Project names, descriptions, document counts |
| **Memories** | Categorized insights Claude learned about you |

## Privacy

**Your data stays local.** The processing script runs entirely on your machine. The generated `processed.json` contains only aggregated statistics and selected highlights - not your full conversation history.

If you deploy online, only the `processed.json` file is uploaded, not your raw export data.

## Customization

### Themes

Edit the theme categories in `scripts/process-export.ts`:

```typescript
const THEME_CATEGORIES = [
  {
    name: 'Your Custom Theme',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
  },
  // ...
];
```

### Design

Colors and typography are defined in `src/app/globals.css`:

```css
:root {
  --terra-cotta: #C15F3C;  /* Accent color */
  --cream: #F7F5F0;        /* Background */
  --charcoal: #2D2A26;     /* Text */
  --sage: #8B9B7E;         /* Muted text */
}
```

## Optional: Deploy Online

If you want to share your year-in-review with a link:

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Static Export
```bash
npm run build
# Upload the .next folder to any static host
```

The `.vercelignore` and `.gitignore` files ensure your raw export data isn't uploaded.

## Tech Stack

- **Next.js 15** - React framework
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **html-to-image** - Share card generation

## License

MIT - Feel free to customize and share!

---

Made with Claude
