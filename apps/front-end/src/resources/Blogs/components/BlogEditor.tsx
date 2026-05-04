import type { SerializedEditorState } from "lexical";

import { DataError } from "@alextheman/utility/v6";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";

import Debug from "src/components/Debug";
import ContentEditable from "src/resources/Blogs/components/ContentEditable";

interface EditorProps {
  initialContent?: SerializedEditorState;
}

function BlogEditor({ initialContent }: EditorProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState>();

  return (
    <>
      <LexicalComposer
        initialConfig={{
          namespace: "lexicon-editor",
          theme: {},
          editorState: (editor) => {
            if (initialContent) {
              const editorState = editor?.parseEditorState(initialContent);
              editor.setEditorState(editorState);
            }
          },
          onError(error: Error) {
            throw new DataError({ error }, "EDITOR_ERROR", error.message);
          },
        }}
      >
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            setEditorState(editorState.toJSON());
          }}
        />
      </LexicalComposer>
      <Debug content={editorState} />
    </>
  );
}

export default BlogEditor;
