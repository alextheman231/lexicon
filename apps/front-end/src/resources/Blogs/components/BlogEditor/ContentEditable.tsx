import type { ContentEditableProps } from "@lexical/react/LexicalContentEditable";

import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

import EditorToolbar from "src/resources/Blogs/components/BlogEditor/EditorToolbar";

function ContentEditable(props?: ContentEditableProps) {
  return (
    <Card sx={{ minWidth: 0 }}>
      <EditorToolbar />
      <Divider />
      <CardContent
        component={LexicalContentEditable}
        className="editor-input"
        sx={{
          outline: "none",
          minHeight: 150,
          typography: "body1",
          padding: 1,
          minWidth: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
        {...props}
      />
    </Card>
  );
}

export default ContentEditable;
