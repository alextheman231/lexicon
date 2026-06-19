import { DataError } from "@alextheman/utility/v6";

interface FetchSoleOptions {
  errorMessage?: string;
}

async function fetchSole<ItemType>(
  query: Promise<Array<ItemType>>,
  options?: FetchSoleOptions,
): Promise<ItemType | null> {
  const results = await query;

  if (results.length > 1) {
    throw new DataError(
      { length: results.length },
      "MULTIPLE_ROWS_ERROR",
      options?.errorMessage ?? "Expected only one or zero rows to be returned.",
    );
  }

  return results[0] ?? null;
}

export default fetchSole;
