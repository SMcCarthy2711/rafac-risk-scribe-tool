# Architecture rules

- Generate joining orders and complete event packs through `src/lib/eventDocumentPdf.ts` so PDF layout, pagination, and kit bullets remain consistent.
- Store formatted assessment fields as sanitized HTML strings, accepting legacy plain text through `src/lib/richText.ts`, so existing saved assessments remain compatible.
- Use Tiptap for assessment editing and shared AutoTable rich-text hooks for PDF cells so formatting survives export without changing pagination.
- Store risk grouping on each risk with an optional section; missing sections are activity risks so old assessments retain their grouping.
