function getSetCookies(headers: any): Array<string> {
  const raw = headers["set-cookie"];
  if (!raw) {
    return [];
  }
  return Array.isArray(raw) ? raw : [raw];
}

export default getSetCookies;
