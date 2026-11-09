/** Keep API table/property pairs distinct without discarding punctuation from their real names. */
export function apiRowAnchor(apiName: string, property: string): string {
  const part = (value: string) => encodeURIComponent(value).replace(/-/g, '%2D');
  return `api-${part(apiName)}--${part(property)}`;
}
