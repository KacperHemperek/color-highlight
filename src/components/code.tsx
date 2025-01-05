import React from "react";

export function InlineCode({ children }: React.PropsWithChildren) {
  return (
    <code className="px-1 text-sky-500 bg-transparent border border-sky-500 font-mono text-sm rounded">
      {children}
    </code>
  );
}
