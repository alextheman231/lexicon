import type { SerializedEditorState } from "lexical";

import Box from "@mui/material/Box";

interface DebugEditorStateProps {
  editorState?: SerializedEditorState;
}

function DebugEditorState({ editorState }: DebugEditorStateProps) {
  return (
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
  );
}

export default DebugEditorState;
