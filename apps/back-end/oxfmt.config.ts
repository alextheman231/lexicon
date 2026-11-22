import { oxfmtConfigBase, oxfmtConfigBaseDefaultOptions } from "@alextheman/configs/oxfmt";

export default oxfmtConfigBase({ignore: [...oxfmtConfigBaseDefaultOptions.ignore, "src/database/migrations/meta"]})
