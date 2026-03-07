import type { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { ComponentProps } from "react";

export type EditorState = Parameters<ComponentProps<typeof OnChangePlugin>["onChange"]>[0];
