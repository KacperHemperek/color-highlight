import { EditorContent, useEditor } from "@tiptap/react";
import { Node, nodeInputRule, nodePasteRule } from "@tiptap/core";
import "./App.css";
import StarterKit from "@tiptap/starter-kit";

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
            class: "color-marker",
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
    extensions: [StarterKit, ColorsPlugin],
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}

function App() {
  return (
    <>
      <main>
        <header>
          <h1>Color Highlight</h1>
          <p>
            Type a color in the hex format <code>#RRGGBB</code> to highlight it
            or paste a text containing colors to see them highlighted. For
            example, try pasting <code>#ff0000</code> or <code>#00ff00</code>.
          </p>
        </header>
        <Editor />
      </main>
      <footer>
        <div>
          <a href="https://github.com/KacperHemperek/color-highlight">
            Source Code
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
