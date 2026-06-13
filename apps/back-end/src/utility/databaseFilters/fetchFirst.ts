async function fetchFirst<ItemType>(query: Promise<Array<ItemType>>): Promise<ItemType | null> {
  const [first] = await query;
  return first ?? null;
}

export default fetchFirst;
