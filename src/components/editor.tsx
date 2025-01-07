import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ColorsPlugin } from "../lib/color-extension";
import Placeholder from "@tiptap/extension-placeholder";
import { ColorMenu, ColorContextMenuExtension } from "./color-context-menu";

export function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ColorsPlugin,
      Placeholder.configure({
        placeholder: "Paste or type your text here...",
        showOnlyCurrent: true,
        emptyEditorClass:
          "text-slate-700 before:content-[attr(data-placeholder)]",
      }),
      ColorContextMenuExtension,
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-96 p-2 border border-slate-700 rounded-md font-mono outline-none focus:ring focus:ring-sky-500",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      <ColorMenu editor={editor} />
    </div>
  );
}
