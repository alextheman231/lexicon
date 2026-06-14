import { DataError } from "@alextheman/utility/v6";

import fetchSole from "src/utility/databaseFilters/fetchSole";

async function fetchValue<ValueType>(
  query: Promise<Array<Record<string, ValueType>>>,
): Promise<ValueType | null> {
  const result = await fetchSole(query);

  if (result === null) {
    return null;
  }

  const values = Object.values(result);

  if (values.length !== 1) {
    throw new DataError(
      { columns: values.length },
      "MULTIPLE_COLUMNS_ERROR",
      "Expected only one column to be returned",
    );
  }

  return values[0];
}

export default fetchValue;
