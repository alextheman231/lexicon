import { DataError } from "@alextheman/utility/v6";

import fetchSole from "src/utility/databaseFilters/fetchSole";

async function fetchValue<ValueType>(
  query: Promise<Array<Record<string, ValueType>>>,
): Promise<ValueType | null> {
  const result = await fetchSole(query);

  if (result === null) {
    return null;
  }

  const columns = Object.keys(result).length;

  if (columns !== 1) {
    throw new DataError(
      { columns },
      "MULTIPLE_COLUMNS_ERROR",
      "Expected only one column to be returned",
    );
  }

  return Object.values(result)[0];
}

export default fetchValue;
