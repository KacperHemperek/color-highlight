import React from "react";
import { CopyIcon } from "./icons/copy";
import { EditIcon } from "./icons/edit";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { TextSelection } from "@tiptap/pm/state";

function useForegroundColor(bgColor: string): string {
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  // Calculate perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on brightness
  return brightness > 128 ? "#000000" : "#ffffff";
}

export function ColorNode(props: NodeViewProps) {
  const pickerRef = React.useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const foregroundColor = useForegroundColor(props.node.attrs.color);

  const color = props.node.attrs.color;

  const putEditorCursorAfterNode = () => {
    props.editor.chain().focus();
    const pos = props.getPos() + 1;
    const tr = props.view.state.tr.setSelection(
      new TextSelection(props.view.state.doc.resolve(pos)),
    );
    props.view.dispatch(tr);
  };

  const closeMenu = () => {
    putEditorCursorAfterNode();
    setMenuOpen(false);
  };

  const copyColorHex = () => {
    navigator.clipboard.writeText(color);
    closeMenu();
  };

  const toggleMenu = (val: boolean) => {
    if (!val) {
      putEditorCursorAfterNode();
    }
    setMenuOpen(val);
  };

  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.updateAttributes({ color: e.target.value });
  };

  return (
    <NodeViewWrapper className="color-node inline">
      <Popover.Root open={menuOpen} onOpenChange={toggleMenu}>
        <Popover.Trigger
          data-color={color}
          style={{ backgroundColor: color, color: foregroundColor }}
          className="px-0.5 py-px cursor-pointer rounded-sm"
        >
          {color}
        </Popover.Trigger>
        <Popover.Portal>
          {menuOpen && (
            <Popover.Content
              side="bottom"
              sideOffset={8}
              align="start"
              className="font-sans min-w-40 max-w-fit bg-slate-900 flex flex-col border border-slate-700 rounded overflow-hidden"
            >
              <button
                onClick={copyColorHex}
                className="p-2 flex items-center text-sm cursor-pointer hover:bg-slate-800 gap-2"
              >
                <CopyIcon className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => pickerRef.current?.click()}
                className="p-2 flex items-center text-sm cursor-pointer relative hover:bg-slate-800 gap-2"
              >
                <input
                  tabIndex={-1}
                  ref={pickerRef}
                  type="color"
                  defaultValue={color}
                  onChange={changeColor}
                  className="visually-hidden absolute top-0 -right-1"
                />
                <EditIcon className="w-4 h-4" />
                Edit
              </button>
            </Popover.Content>
          )}
        </Popover.Portal>
      </Popover.Root>
    </NodeViewWrapper>
  );
}
