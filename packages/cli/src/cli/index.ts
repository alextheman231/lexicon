import { Command } from "commander";

import createCommands from "src/cli/commands";
import formatError from "src/utility/formatError";

import packageInfo from "package.json" with { type: "json" };

(async () => {
  try {
    const program = new Command();
    program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version);

    createCommands(program);
    await program.parseAsync(process.argv);
  } catch (error) {
    formatError(error);
  }
})();
