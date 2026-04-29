import type { TextFormatType } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import Toolbar from "@mui/material/Toolbar";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useState } from "react";
import { MdFormatBold, MdFormatItalic } from "react-icons/md";

import FormatTextButton from "src/resources/Blogs/components/FormatTextButton";

function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState<Partial<Record<TextFormatType, boolean>>>({
    bold: false,
    italic: false,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        setFormats((previous) => {
          const next = $isRangeSelection(selection)
            ? {
                bold: selection.hasFormat("bold"),
                italic: selection.hasFormat("italic"),
              }
            : { bold: false, italic: false };

          return previous.bold === next.bold && previous.italic === next.italic ? previous : next;
        });
      });
    });
  }, [editor]);

  return (
    <Toolbar
      disableGutters
      sx={{
        minHeight: "auto",
        px: 1,
        gap: 1,
      }}
    >
      <FormatTextButton icon={MdFormatBold} formatType="bold" active={formats.bold} />
      <FormatTextButton icon={MdFormatItalic} formatType="italic" active={formats.italic} />
    </Toolbar>
  );
}

export default EditorToolbar;
