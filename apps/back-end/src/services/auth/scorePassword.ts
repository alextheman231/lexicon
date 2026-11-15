import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import { adjacencyGraphs, dictionary as commonDictionary } from "@zxcvbn-ts/language-common";
import { dictionary as englishDictionary } from "@zxcvbn-ts/language-en";

import WeakPasswordError from "src/services/auth/errors/WeakPasswordError";

interface VerifyPasswordOptions {
  minimumStrength?: number;
}

function scorePassword(password: string, options?: VerifyPasswordOptions): void {
  const zxcvbn = new ZxcvbnFactory({
    graphs: adjacencyGraphs,
    dictionary: {
      ...commonDictionary,
      ...englishDictionary,
    },
  });

  const { score } = zxcvbn.check(password);

  const minimumStrength = options?.minimumStrength ?? 3;

  if (score < minimumStrength) {
    throw new WeakPasswordError();
  }
}

export default scorePassword;
