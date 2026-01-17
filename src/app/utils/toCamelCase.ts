export function ToCamelCase(field: string): string {
  return field.charAt(0).toLowerCase() + field.slice(1);
}
