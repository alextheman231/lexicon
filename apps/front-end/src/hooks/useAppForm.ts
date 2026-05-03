import { createFormHook } from "@alextheman/components/v7";

import BackButton from "src/components/BackButton";

const { useAppForm } = createFormHook({ formComponents: { BackButton } });

export default useAppForm;
