import { createFormHook } from "@alextheman/components/form";

import BackButton from "src/components/BackButton";
import FormButton from "src/components/FormButton";

const { useAppForm } = createFormHook({
  formComponents: { BackButton, FormButton },
});

export default useAppForm;
