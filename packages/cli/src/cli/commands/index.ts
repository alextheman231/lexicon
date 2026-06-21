import type { Command } from "commander";

import buildStatic from "src/cli/commands/build-static";
import loadCommands from "src/utility/loadCommands";

function createCommands(program: Command) {
  loadCommands(program, { buildStatic });
}

export default createCommands;
