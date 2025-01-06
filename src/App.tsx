import { InlineCode } from "./components/code";
import { Editor } from "./components/editor";

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
