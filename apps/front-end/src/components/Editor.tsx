import type { SerializedEditorState } from "lexical";

import { DataError } from "@alextheman/utility";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";

interface EditorProps {
  initialContent?: SerializedEditorState;
}

function Editor({ initialContent }: EditorProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState>();

  return (
    <>
      <LexicalComposer
        initialConfig={{
          namespace: "blog-editor",
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
      <pre>{JSON.stringify(editorState, null, 2)}</pre>
    </>
  );
}

export default Editor;
