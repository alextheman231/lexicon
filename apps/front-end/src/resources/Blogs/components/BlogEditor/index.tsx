import type { SerializedEditorState } from "lexical";
import type { Dispatch, SetStateAction } from "react";

import { DataError } from "@alextheman/utility/v6";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { defineExtension } from "lexical";
import { useState } from "react";

import ContentEditable from "src/resources/Blogs/components/BlogEditor/ContentEditable";

interface EditorProps {
  initialContent?: SerializedEditorState | string;
  setEditorState: Dispatch<SetStateAction<SerializedEditorState | undefined>>;
}

function BlogEditor({ initialContent, setEditorState }: EditorProps) {
  const [extension] = useState(() => {
    return defineExtension({
      name: "lexicon-editor",
      namespace: "lexicon-editor",
      theme: {},
      onError(error: Error) {
        throw new DataError({ error }, "EDITOR_ERROR", error.message);
      },
      $initialEditorState: (editor) => {
        if (initialContent) {
          const editorState = editor.parseEditorState(initialContent);
          editor.setEditorState(editorState);
        }
      },
    });
  });

  return (
    <LexicalExtensionComposer extension={extension} contentEditable={null}>
      <RichTextPlugin contentEditable={<ContentEditable />} ErrorBoundary={LexicalErrorBoundary} />
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          setEditorState(editorState.toJSON());
        }}
      />
    </LexicalExtensionComposer>
  );
}

export default BlogEditor;
