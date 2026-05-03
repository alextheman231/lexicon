import type { ButtonProps } from "@mui/material/Button";

import { InternalLink, useFormContext } from "@alextheman/components/v7";
import Button from "@mui/material/Button";

export interface BackButtonProps extends Omit<ButtonProps, "type"> {
  /** An option to disable the button on submit if the form is not dirty. */
  disableClean?: boolean;
  /** The label for the button. */
  children?: string;
  /** The location to navigate back to. */
  to: string;
}

function BackButton({ disableClean, children = "Back", to, ...buttonProps }: BackButtonProps) {
  const form = useFormContext();

  return (
    <Button
      component={InternalLink}
      color="primary"
      disabled={buttonProps.disabled || (disableClean && !form.state.isDirty)}
      loading={form.state.isSubmitting}
      variant="outlined"
      to={to}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

export default BackButton;
