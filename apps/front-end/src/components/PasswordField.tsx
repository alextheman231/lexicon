import type { TextFieldProps } from "@mui/material/TextField";

import { useFieldContext } from "@alextheman/components/form";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import combineHelperText from "src/components/helpers/combineHelperText";

export type PasswordFieldProps = Omit<TextFieldProps, "name">;

function PasswordField({ helperText, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const field = useFieldContext();

  return (
    <TextField
      {...props}
      name={field.name}
      onChange={(event) => {
        field.handleChange(event.target.value);
      }}
      onBlur={field.handleBlur}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => {
                  setShowPassword((previous) => {
                    return !previous;
                  });
                }}
                tabIndex={-1}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      error={field.state.meta.errors.length !== 0}
      helperText={combineHelperText(helperText, field.state.meta.errors)}
      margin="normal"
      type={showPassword ? "text" : "password"}
    />
  );
}

export default PasswordField;
