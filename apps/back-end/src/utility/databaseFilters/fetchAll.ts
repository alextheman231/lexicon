async function fetchAll<ItemType>(query: Promise<Array<ItemType>>): Promise<Array<ItemType>> {
  return await query;
}

export default fetchAll;
