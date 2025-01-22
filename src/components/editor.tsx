import { Editor as EditorType, EditorContent } from "@tiptap/react";

type EditorProps = { editor: EditorType | null };

export function Editor({ editor }: EditorProps) {
  if (!editor) return null;

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
