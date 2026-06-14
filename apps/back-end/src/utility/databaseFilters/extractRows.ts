async function extractRows<RowType>(
  query: Promise<{ rows: Array<RowType> }>,
): Promise<Array<RowType>> {
  const { rows } = await query;
  return rows;
}

export default extractRows;
