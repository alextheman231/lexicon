import type { TextFormatType } from "lexical";
import type { IconType } from "react-icons/lib";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import IconButton from "@mui/material/IconButton";
import { FORMAT_TEXT_COMMAND } from "lexical";

interface FormatTextButtonProps {
  formatType: TextFormatType;
  icon: IconType;
  active?: boolean;
}

function FormatTextButton({ formatType, icon: Icon, active }: FormatTextButtonProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <IconButton
      color={active ? "primary" : "default"}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
      }}
    >
      <Icon />
    </IconButton>
  );
}

export default FormatTextButton;
