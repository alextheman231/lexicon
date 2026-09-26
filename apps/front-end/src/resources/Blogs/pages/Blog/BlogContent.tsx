import { DataError } from "@alextheman/utility/v6";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { defineExtension } from "lexical";
import { useRef } from "react";

import ContentReadable from "src/resources/Blogs/components/BlogEditor/ContentReadable";

interface BlogContentProps {
  content: unknown;
}

function BlogContent({ content }: BlogContentProps) {
  const extensionRef = useRef(
    defineExtension({
      name: "lexicon-blog-viewer",
      namespace: "lexicon-blog-viewer",
      $initialEditorState: typeof content === "string" ? content : JSON.stringify(content),
      editable: false,
      onError(error: Error) {
        throw new DataError({ error }, "LEXICAL_ERROR", error.message);
      },
    }),
  );

  return (
    <LexicalExtensionComposer extension={extensionRef.current} contentEditable={null}>
      <RichTextPlugin contentEditable={<ContentReadable />} ErrorBoundary={LexicalErrorBoundary} />
    </LexicalExtensionComposer>
  );
}

export default BlogContent;
