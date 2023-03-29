export function capitalizeFirstLetter(string: string): string {
  const firstLetterCapitalizedString =
    string.charAt(0).toUpperCase() + string.slice(1);
  return firstLetterCapitalizedString;
}
