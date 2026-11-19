import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, RemoveFormatting } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { editorContent, sanitizeRichText } from '@/lib/richText';

interface Props { id?: string; value: string; onChange: (value: string) => void; label?: string }
export default function RichTextEditor({ id, value, onChange, label }: Props) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: false, code: false, codeBlock: false, blockquote: false, horizontalRule: false }), Underline],
    content: editorContent(value || ''),
    editorProps: { attributes: { id: id || '', role: 'textbox', 'aria-label': label || id || 'Formatted text', 'aria-multiline': 'true', class: 'rich-text-content min-h-24 px-3 py-2 text-sm outline-none' } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : sanitizeRichText(editor.getHTML())),
  });
  useEffect(() => {
    if (editor && editor.getHTML() !== editorContent(value || '') && !editor.isFocused) editor.commands.setContent(editorContent(value || ''), false);
  }, [editor, value]);
  if (!editor) return null;
  const tools = [
    { name: 'Bold', Icon: Bold, active: editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
    { name: 'Italic', Icon: Italic, active: editor.isActive('italic'), run: () => editor.chain().focus().toggleItalic().run() },
    { name: 'Underline', Icon: UnderlineIcon, active: editor.isActive('underline'), run: () => editor.chain().focus().toggleUnderline().run() },
    { name: 'Strikethrough', Icon: Strikethrough, active: editor.isActive('strike'), run: () => editor.chain().focus().toggleStrike().run() },
    { name: 'Bullet list', Icon: List, active: editor.isActive('bulletList'), run: () => editor.chain().focus().toggleBulletList().run() },
    { name: 'Numbered list', Icon: ListOrdered, active: editor.isActive('orderedList'), run: () => editor.chain().focus().toggleOrderedList().run() },
    { name: 'Clear formatting', Icon: RemoveFormatting, active: false, run: () => editor.chain().focus().clearNodes().unsetAllMarks().run() },
  ];
  return <div className="rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring min-w-0">
    <div role="toolbar" aria-label={`${label || id} formatting`} className="flex flex-wrap gap-1 border-b border-border bg-muted p-1">
      {tools.map(({ name, Icon, active, run }) => <Button key={name} type="button" variant={active ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" title={name} aria-label={name} aria-pressed={active} onMouseDown={event => event.preventDefault()} onClick={run}><Icon className="h-4 w-4" /></Button>)}
    </div>
    <EditorContent editor={editor} />
  </div>;
}
