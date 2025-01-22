import React from "react";
import { InlineCode } from "./components/code";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ColorsPlugin } from "./lib/color-extension";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor } from "./components/editor";
import { RefreshIcon } from "./components/icons/refresh";

function useAppEditor() {
  return useEditor({
    extensions: [
      StarterKit,
      ColorsPlugin,
      Placeholder.configure({
        placeholder: "Paste or type your text here...",
        showOnlyCurrent: true,
        emptyEditorClass:
          "text-slate-700 before:content-[attr(data-placeholder)]",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-96 w-full p-2 border border-slate-700 rounded-md font-mono outline-none focus:ring focus:ring-sky-500",
      },
    },
  });
}

function Container({ children }: React.PropsWithChildren) {
  return <div className="container max-w-3xl mx-auto">{children}</div>;
}

function App() {
  const [showSecondEditor, setShowSecondEditor] = React.useState(false);
  const mainEditor = useAppEditor();
  const secondEditor = useAppEditor();

  const copyContent = () => {
    if (!mainEditor || !secondEditor) return;
    const mainContent = mainEditor.getHTML();
    secondEditor.commands.setContent(mainContent);
  };

  return (
    <>
      <main className="flex flex-col mx-auto w-full py-6 px-24">
        <Container>
          <header className="pb-4">
            <h1 className="text-2xl font-bold pb-2">Color Highlight</h1>
            <p>
              Type a color in the hex format <InlineCode>#RRGGBB</InlineCode> to
              highlight it or paste a text containing colors to see them
              highlighted. For example, try pasting{" "}
              <InlineCode>#0ea5e9</InlineCode> or{" "}
              <InlineCode>#020617</InlineCode>.
            </p>
          </header>
        </Container>
        <div className="pb-2 flex items-center gap-4">
          <label className=" cursor-pointer max-w-fit py-1 select-none">
            <input
              type="checkbox"
              checked={showSecondEditor}
              onChange={(e) => setShowSecondEditor(e.target.checked)}
              className="mr-2"
            />
            Show second editor
          </label>
          {showSecondEditor && (
            <button
              className="flex gap-2 items-center bg-sky-500 px-2 py-1 rounded text-sm"
              onClick={copyContent}
            >
              <RefreshIcon className="w-4 h-4" />
              Sync second editor
            </button>
          )}
        </div>
        <div className="flex gap-4 w-full">
          <Editor editor={mainEditor} />
          {showSecondEditor && <Editor editor={secondEditor} />}
        </div>
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
