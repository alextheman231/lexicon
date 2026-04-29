import type { SerializedEditorState } from "lexical";

import { DataError } from "@alextheman/utility/v6";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import Box from "@mui/material/Box";
import { useState } from "react";

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
      <Box
        sx={{
          marginTop: 2,
          padding: 1,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {JSON.stringify(editorState, null, 2)}
      </Box>
    </>
  );
}

export default BlogEditor;
