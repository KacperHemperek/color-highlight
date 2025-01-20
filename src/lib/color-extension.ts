import { InputRule, mergeAttributes, Node, nodePasteRule } from "@tiptap/core";
import { ColorNode } from "../components/color-context-menu";
import { ReactNodeViewRenderer } from "@tiptap/react";

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

export const ColorsPlugin = Node.create({
  name: "colorsMarker",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      color: {
        default: null,
        renderHTML(attributes) {
          return {
            "data-color": attributes.color || "transparent",
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-color]",
        getAttrs: (dom) => {
          const color = dom.getAttribute("data-color");
          return color ? { color } : { color: null };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const color = HTMLAttributes["data-color"];
    const attr = {
      style: getStyleString(color),
      class: "px-0.5 py-px cursor-pointer rounded-sm",
    };
    return ["color-node", mergeAttributes(HTMLAttributes, attr), color];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ColorNode);
  },
  addInputRules() {
    const type = this.type;
    const isInline = type.isInline;
    return [
      new InputRule({
        find: colorRegexInput,
        handler({ match, range, state: { tr } }) {
          const start = range.from;
          let end = range.to;

          const newNode = type.create({ color: match[0] });

          if (match[0]) {
            const insertionStart = isInline ? start : start - 1;

            tr.insert(insertionStart, newNode).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          }
          tr.scrollIntoView();
        },
      }),
    ];
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: colorRegexPaste,
        type: this.type,
        getAttributes: (match) => {
          return {
            color: match[0],
          };
        },
      }),
    ];
  },
});
