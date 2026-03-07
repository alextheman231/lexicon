function defineEndpoint(...parts: Array<string>): string {
  // Normalise only the input paths. We don't want to strip the leading slash from the prefix.
  const normalisedParts = parts.filter(Boolean).map((part) => {
    return part.replace(/^\/+|\/+$/g, "");
  });

  return ["/api", ...normalisedParts].join("/");
}

export default defineEndpoint;
