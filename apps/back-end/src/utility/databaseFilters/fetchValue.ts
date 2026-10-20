import fetchSole from "src/utility/databaseFilters/fetchSole";
import DataError from "src/utility/errors/DataError";

async function fetchValue<ValueType>(
  query: Promise<Array<Record<string, ValueType>>>,
): Promise<ValueType | undefined> {
  const errorMessage = "Expected exactly one row to be returned.";
  const result = await fetchSole(query, { errorMessage });

  if (result === null) {
    return undefined;
  }

  const values = Object.values(result);

  if (values.length !== 1) {
    throw new DataError({ columns: values.length }, "MULTIPLE_COLUMNS_ERROR", errorMessage);
  }

  return values[0];
}

export default fetchValue;
