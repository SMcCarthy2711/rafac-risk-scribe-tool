# PDF exports for event documents

## Changes
- Add a shared PDF builder for joining orders and complete event packs using the existing PDF library.
- Lay out event details, travel, kit, schedule, and risk-assessment references with automatic page breaks.
- Render kit entries as aligned PDF bullets with captions on separate indented lines, avoiding HTML bullet inconsistencies.
- Change the joining-orders and complete-event-pack downloads from `.html` to `.pdf` and update the button label.

## Technical details
- Generate A4 portrait documents directly with jsPDF and `jspdf-autotable`; no browser print dialog or HTML conversion.
- Normalise saved JSON values before rendering so missing or older kit/travel records do not break exports.
- Preserve the existing database reads and joining-order generation flow.

## Verification
- Check the app build after edits.
- Exercise both PDF download actions in the preview and inspect representative exported PDF pages for clipping, bullet alignment, and page breaks.
