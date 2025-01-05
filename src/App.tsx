import { EditorContent, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Node, nodeInputRule, nodePasteRule } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { InlineCode } from "./components/code";

const colorRegexInput = /#([A-Fa-f0-9]{6})$/;
const colorRegexPaste = /#([A-Fa-f0-9]{6})/g;

/**
 * Determines if black or white text is more readable on a given background color.
 * @param {string} bgColor - Background color in 6-character hex (e.g., "#ff0000").
 * @returns {string} - Recommended text color ("#000000" for black, "#ffffff" for white).
 */
function getForegroundColor(bgColor: string): string {
  // Extract RGB values from 6-character hex
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  // Calculate perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on brightness
  return brightness > 128 ? "#000000" : "#ffffff";
}

function getStyleString(color: string | undefined) {
  // Fallback to transparent if color is missing
  return `background-color: ${color || "transparent"}; color: ${getForegroundColor(color || "#000000")};`;
}

const ColorsPlugin = Node.create({
  name: "colorsMarker",
  group: "inline",
  inline: true,
  atom: false,
  onUpdate() {
    console.log(this.editor.getJSON());
  },
  addAttributes() {
    return {
      color: {
        default: null,
        renderHTML(attributes) {
          return {
            style: getStyleString(attributes.color),
            "data-color": attributes.color || "transparent",
            class: "px-[1px] py-0.5 rounded-sm",
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-color]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, HTMLAttributes["data-color"]];
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: colorRegexInput,
        type: this.type,
        getAttributes: (match) => ({
          color: match[0],
        }),
      }),
    ];
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: colorRegexPaste,
        type: this.type,
        getAttributes: (match) => ({
          color: match[0],
        }),
      }),
    ];
  },
});

function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ColorsPlugin,
      Placeholder.configure({
        placeholder: "Paste or type your text here...",
        emptyNodeClass:
          "text-slate-700 before:content-[attr(data-placeholder)]",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-96 p-2 border border-slate-700 rounded-md font-mono outline-none focus:ring focus:ring-sky-500",
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}

function App() {
  return (
    <>
      <main className="flex flex-col max-w-3xl mx-auto py-6">
        <header className="pb-4">
          <h1 className="text-2xl font-bold pb-2">Color Highlight</h1>
          <p>
            Type a color in the hex format <InlineCode>#RRGGBB</InlineCode> to
            highlight it or paste a text containing colors to see them
            highlighted. For example, try pasting{" "}
            <InlineCode>#0ea5e9</InlineCode> or <InlineCode>#020617</InlineCode>
            .
          </p>
        </header>
        <Editor />
      </main>
      <footer className="flex flex-col gap-4 mt-auto bg-slate-950 text-center py-6 text-slate-300 text-sm">
        <section>
          Source code can be found on{" "}
          <a
            className="transition underline hover:text-slate-100"
            href="https://github.com/KacperHemperek/color-highlight"
            target="_blank"
          >
            Github
          </a>
        </section>
        <section>
          If you found some bugs or have any suggestions, feel free to open an{" "}
          <a
            className="transition underline hover:text-slate-100"
            href="https://github.com/KacperHemperek/color-highlight/issues/new"
            target="_blank"
          >
            issue
          </a>
          .
        </section>
      </footer>
    </>
  );
}

export default App;
