import { DataError } from "@alextheman/utility/v6";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

interface BlogContentProps {
  content: unknown;
}

function BlogContent({ content }: BlogContentProps) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "lexicon-blog-viewer",
        editorState: typeof content === "string" ? content : JSON.stringify(content),
        editable: false,
        onError(error: Error) {
          throw new DataError({ error }, "LEXICAL_ERROR", error.message);
        },
      }}
    >
      <RichTextPlugin
        contentEditable={<ContentEditable readOnly />}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}

export default BlogContent;
