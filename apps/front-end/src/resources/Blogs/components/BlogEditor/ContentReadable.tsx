import type { ContentEditableElementProps } from "@lexical/react/LexicalContentEditable";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import Box from "@mui/material/Box";

type ContentReadableProps = Omit<ContentEditableElementProps, "editor" | "readOnly"> &
  (
    | {
        "aria-placeholder"?: void | undefined;
        placeholder?: null;
      }
    | {
        "aria-placeholder": string;
        placeholder: ((isEditable: boolean) => null | React.JSX.Element) | React.JSX.Element;
      }
  );

function ContentReadable(props?: ContentReadableProps) {
  return (
    <Box
      component={ContentEditable}
      readOnly
      className="editor-input"
      sx={{
        outline: "none",
        typography: "body1",
        minWidth: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
      {...props}
    />
  );
}

export default ContentReadable;
