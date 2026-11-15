import { createFormHook } from "@alextheman/components/form";

import BackButton from "src/components/BackButton";
import FormButton from "src/components/FormButton";
import PasswordField from "src/components/PasswordField";
import PasswordWithStrengthField from "src/components/PasswordWithStrengthField";

const { useAppForm } = createFormHook({
  formComponents: { BackButton, FormButton },
  fieldComponents: { PasswordField, PasswordWithStrengthField },
});

export default useAppForm;
