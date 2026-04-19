async function getIdFromFactoryResource<
  ID extends string | number,
  FactoryData extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
  ResourceType extends { id: ID } = { id: ID },
>(
  resource: ID | ResourceType | undefined,
  factory: { insert: (data?: FactoryData) => Promise<ResourceType> },
  factoryData?: FactoryData,
): Promise<ID> {
  if (resource === undefined) {
    const newResource = await factory.insert(factoryData);
    return newResource.id;
  }
  if (typeof resource === "object") {
    return resource.id;
  }
  return resource;
}

export default getIdFromFactoryResource;
