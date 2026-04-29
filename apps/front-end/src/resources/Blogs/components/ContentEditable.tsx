import type { ContentEditableProps } from "@lexical/react/LexicalContentEditable";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

function ContentEditable(
  props?: Omit<
    ForwardRefExoticComponent<ContentEditableProps & RefAttributes<HTMLDivElement>>,
    "$$typeof"
  >,
) {
  return (
    <Card sx={{ minWidth: 0 }}>
      <Box
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
