import type { SQL } from "drizzle-orm";

import { sql } from "drizzle-orm";

function paginate(pageSize: number, pageNumber: number = 1): SQL {
  return sql`
    LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize}
  `;
}

export default paginate;
