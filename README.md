# MoveShelf

MoveShelf is a React + Vite + TypeScript moving-box inventory app for Cloudflare Pages with Supabase as the only backend. It tracks boxes, contents, destinations, QR labels, CSV import/export, and print-friendly inventory reports.

## Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and add:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PUBLIC_APP_URL=http://localhost:5173
```

4. Run locally:

```bash
npm install
npm run dev
```

5. Deploy to Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Add the same environment variables in Cloudflare Pages.
- Set `VITE_PUBLIC_APP_URL` to your production Pages URL so printed QR codes point to the hosted app.

## Main Routes

- `/` Dashboard with status counts, recent boxes, and the large "Where is it?" search.
- `/boxes` searchable box list with quick status updates, bulk label selection, and CSV export.
- `/boxes/new` add a box with automatic `BOX-001` style numbering.
- `/box/:boxNumber` detail page with QR code, status buttons, edit, and print label actions.
- `/labels` label printing for all, selected, unprinted, status, destination room, priority, or box-number ranges.
- `/open-first` print-friendly report grouped by destination room for Open First, Important, and Critical boxes.
- `/report` print-friendly full inventory report.
- `/import` CSV import with duplicate `box_number` validation and preview.

## Label Printing

The label sheet is styled for US letter 8.5x11 paper with 6 labels per page, 2 columns by 3 rows. Use your browser print dialog to print directly or choose "Save as PDF".
