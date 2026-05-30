import type { ButtonProps } from "@mui/material/Button";

import { useFormContext } from "@alextheman/components/form";
import Button from "@mui/material/Button";

function FormButton({ children, ...props }: ButtonProps) {
  const form = useFormContext();

  return (
    <Button loading={form.state.isSubmitting} {...props}>
      {children}
    </Button>
  );
}

export default FormButton;
