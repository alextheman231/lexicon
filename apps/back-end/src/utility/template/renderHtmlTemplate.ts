import handlebars from "handlebars";

import { readFile } from "node:fs/promises";
import path from "node:path";

async function renderHtmlTemplate(
  templatePath: string,
  context: Record<string, unknown>,
): Promise<string> {
  return handlebars.compile(
    await readFile(path.join(process.cwd(), "templates", templatePath), "utf-8"),
  )(context);
}

export default renderHtmlTemplate;
