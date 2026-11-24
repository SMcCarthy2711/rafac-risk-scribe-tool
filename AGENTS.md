# Architecture rules

- Generate joining orders and complete event packs through `src/lib/eventDocumentPdf.ts` so PDF layout, pagination, and kit bullets remain consistent.
- Store formatted assessment fields as sanitized HTML strings, accepting legacy plain text through `src/lib/richText.ts`, so existing saved assessments remain compatible.
- Use Tiptap for assessment editing and shared AutoTable rich-text hooks for PDF cells so formatting survives export without changing pagination.
- Store risk grouping on each risk with an optional section; missing sections are activity risks so old assessments retain their grouping.
- Persist event descriptions and squadron metadata on event plans; use shared rich-text rendering for descriptions in previews and PDFs so saved formatting stays consistent.
- Store schedule end dates explicitly and derive new-item defaults through `src/lib/eventSchedule.ts` so overnight items carry their finish date and time correctly.
- Use shared draft date entry with the Shadcn calendar in Event Builder; commit only complete validated dates so typing a year cannot persist partial years.
