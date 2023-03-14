export function formatNameInput(input: string): string {
  const formattedName = (input.charAt(0).toUpperCase() + input.slice(1)).trim();
  return formattedName;
}
