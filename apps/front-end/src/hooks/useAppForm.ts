import { createFormHook } from "@alextheman/components/form";

import BackButton from "src/components/BackButton";

const { useAppForm } = createFormHook({ formComponents: { BackButton } });

export default useAppForm;
