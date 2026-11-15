import type { AlertColor } from "@mui/material/Alert";

import type { PasswordFieldProps } from "src/components/PasswordField";

import { useFieldContext } from "@alextheman/components/form";
import { DataError } from "@alextheman/utility/v6";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "@tanstack/react-store";
import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import { adjacencyGraphs, dictionary as commonDictionary } from "@zxcvbn-ts/language-common";
import { dictionary as englishDictionary } from "@zxcvbn-ts/language-en";

import PasswordField from "src/components/PasswordField";

const zxcvbn = new ZxcvbnFactory({
  graphs: adjacencyGraphs,
  dictionary: {
    ...commonDictionary,
    ...englishDictionary,
  },
});

function resolveScore(score: number): [AlertColor, string] {
  if (score <= 1) {
    return ["error", "Weak"];
  }
  if (score >= 2 && score < 3) {
    return ["warning", "Fair"];
  }
  if (score >= 3 && score < 4) {
    return ["success", "Good"];
  }
  if (score >= 4) {
    return ["success", "Strong"];
  }

  throw new DataError(
    { score },
    "INVALID_SCORE",
    "Could not resolve a colour and label for the given score.",
  );
}

function PasswordWithStrengthField(props: Omit<PasswordFieldProps, "helperText">) {
  const field = useFieldContext();
  const value = useSelector(field.store, (state) => {
    return state.value;
  });

  const { score } = zxcvbn.check((value as string) ?? "");
  const [progressColour, helperText] = resolveScore(score);

  const scorePercentage = (score / 4) * 100;

  return (
    <>
      <PasswordField helperText={helperText} {...props} />
      <LinearProgress
        color={progressColour}
        sx={{
          margin: "0 4px 24px 4px",
        }}
        value={scorePercentage}
        variant="determinate"
      />
    </>
  );
}

export default PasswordWithStrengthField;
