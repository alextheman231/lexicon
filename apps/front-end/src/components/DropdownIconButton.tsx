import type { DropdownMenuTriggerProps } from "@alextheman/components/DropdownMenu";

import { DropdownMenuTrigger } from "@alextheman/components/DropdownMenu";
import IconButton from "@mui/material/IconButton";
import { MdMoreVert } from "react-icons/md";

function DropdownMenuIconButton({
  children,
  ...props
}: Omit<DropdownMenuTriggerProps<typeof IconButton>, "component">) {
  return (
    <DropdownMenuTrigger component={IconButton} {...props}>
      {children ?? <MdMoreVert />}
    </DropdownMenuTrigger>
  );
}

export default DropdownMenuIconButton;
