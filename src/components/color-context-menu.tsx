import React from "react";
import { Editor, Extension } from "@tiptap/core";
import { Plugin, PluginKey, Transaction } from "@tiptap/pm/state";
import { Node, ResolvedPos } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";
import { CopyIcon } from "./icons/copy";
import { EditIcon } from "./icons/edit";

const SHOW_COLOR_MENU = "SHOW_COLOR_MENU_EVENT";
const HIDE_COLOR_MENU = "HIDE_COLOR_MENU_EVENT";

interface ContextMenuState {
  showMenu: boolean;
  nodePos: number | undefined;
  node: Node | undefined; // Replace `any` with your node type if available
}

const contextMenuPluginKey = new PluginKey<ContextMenuState>(
  "contextMenuPlugin",
);

const initialContextMenuState: ContextMenuState = {
  showMenu: false,
  nodePos: undefined,
  node: undefined,
};

const contextMenuPlugin = new Plugin<ContextMenuState>({
  key: contextMenuPluginKey,
  state: {
    init: (): ContextMenuState => initialContextMenuState,
    apply(tr, prevState): ContextMenuState {
      const event = tr.getMeta(contextMenuPluginKey);
      // Handle possible events here
      switch (event?.type) {
        case HIDE_COLOR_MENU:
          return initialContextMenuState;
        case SHOW_COLOR_MENU:
          return {
            showMenu: true,
            nodePos: event.nodePos,
            node: event.node,
          };
        default:
          return prevState;
      }
    },
  },
  props: {
    handleClick(view: EditorView, pos: number, event: MouseEvent): boolean {
      const nodeEl = event.target as HTMLSpanElement;
      if (nodeEl && "color" in nodeEl.dataset && nodeEl.dataset.color) {
        // This is a workaround when clicking on the right side of the color node
        // for some reason the pos is off by one like if click happened on the node after
        // the color node instead of the color node itself
        const resolvedPos = view.state.doc.resolve(pos);
        if (resolvedPos.nodeBefore?.type.name === "colorsMarker") {
          pos -= 1;
        }
        let node = view.state.doc.nodeAt(pos);
        const tr = view.state.tr.setMeta(contextMenuPluginKey, {
          type: SHOW_COLOR_MENU,
          color: nodeEl.dataset.color,
          nodePos: pos,
          node,
        });
        view.dispatch(tr);
        return true;
      }
      const tr = view.state.tr.setMeta(contextMenuPluginKey, {
        type: HIDE_COLOR_MENU,
      });
      view.dispatch(tr);
      return false;
    },
  },
});

export const ColorContextMenuExtension = Extension.create({
  name: "colorContextMenu",
  addProseMirrorPlugins: () => [contextMenuPlugin],
});

type ContextMenuProps = {
  editor: Editor;
};

type MenuState = {
  showMenu: boolean;
  position: { x: number; y: number };
  color?: string;
  nodePos?: number;
};

export function ColorMenu({ editor }: ContextMenuProps) {
  const [menuState, setMenuState] = React.useState<MenuState>({
    showMenu: false,
    position: { x: 0, y: 0 },
    color: undefined,
    nodePos: undefined,
  });

  const handleContextMenuTransaction = React.useCallback(
    (_event: { editor: Editor; transaction: Transaction }) => {
      const MENU_PADDING = 8;
      const state = contextMenuPluginKey.getState(editor.state);
      console.log("state", state);
      if (state?.showMenu && state.nodePos !== undefined) {
        const coords = editor.view.coordsAtPos(state.nodePos);
        console.log("coords", coords);
        const color = state.node?.attrs?.color || null;
        console.log("color", color);

        setMenuState({
          showMenu: true,
          position: {
            x: coords.left,
            y: coords.bottom + MENU_PADDING,
          },
          color,
          nodePos: state.nodePos,
        });
      } else {
        setMenuState({
          showMenu: false,
          position: { x: 0, y: 0 },
          color: undefined,
          nodePos: undefined,
        });
      }
    },
    [],
  );

  React.useEffect(() => {
    editor.on("transaction", handleContextMenuTransaction);

    return () => {
      // Cleanup event listeners
      console.log("cleanup event listeners");
      editor.off("transaction", handleContextMenuTransaction);
    };
  }, [editor, handleContextMenuTransaction]);

  const copyColorHex = () => {
    if (menuState.color) {
      navigator.clipboard.writeText(menuState.color);
      const tr = editor.state.tr.setMeta(contextMenuPluginKey, {
        type: HIDE_COLOR_MENU,
      });
      editor.view.dispatch(tr);
      if (menuState.nodePos !== undefined) {
        // Focus editor and place cursor after the color node that was copied
        editor
          .chain()
          .focus(menuState.nodePos + 1)
          .run();
      }
    }
  };

  if (!menuState.showMenu) return null;

  return (
    <div
      style={{ top: menuState.position.y, left: menuState.position.x }}
      className="min-w-40 max-w-fit bg-slate-900 flex flex-col border border-slate-700 rounded fixed overflow-hidden"
    >
      <button
        onClick={copyColorHex}
        className="p-2 flex items-center text-sm cursor-pointer hover:bg-slate-800 gap-2"
      >
        <CopyIcon className="w-4 h-4" />
        Copy
      </button>
      <button className="p-2 flex items-center text-sm cursor-pointer hover:bg-slate-800 gap-2">
        <EditIcon className="w-4 h-4" />
        Edit
      </button>
    </div>
  );
}

/**
 * Helper function to get the color node at the given position, if node is not found, return null
 *
 * @param r ResolvedPos
 * @returns Node | null
 *
 */
function getColorNode(r: ResolvedPos) {
  if (r.nodeAfter && r.nodeAfter.type.name === "colorsMarker") {
    return r.nodeAfter;
  }
  if (r.nodeBefore && r.nodeBefore.type.name === "colorsMarker") {
    return r.nodeBefore;
  }
  return null;
}
