import { removeDuplicates } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

async function fetchValues<ValueType>(
  query: Promise<Array<Record<string, ValueType>>>,
): Promise<Array<ValueType>> {
  const results = await query;

  if (results.length === 0) {
    return [];
  }

  const columnNames = results.map((result) => {
    const objectKeys = Object.keys(result);

    if (objectKeys.length !== 1) {
      throw new DataError(
        { columns: objectKeys.length },
        "MULTIPLE_COLUMNS_ERROR",
        "Expected only one column to be returned",
      );
    }

    return objectKeys[0];
  });

  const uniqueColumnNames = removeDuplicates(columnNames);

  if (uniqueColumnNames.length !== 1) {
    throw new DataError(
      {
        uniqueColumnNames,
        uniqueColumnNamesCount: uniqueColumnNames.length,
      },
      "MULTIPLE_UNIQUE_COLUMN_NAMES",
      "Expected each row to contain the same single column name.",
    );
  }

  const [columnName] = uniqueColumnNames;

  return results.map((result) => {
    return result[columnName];
  });
}

export default fetchValues;
