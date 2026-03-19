/**
 * Computes years of experience as a decimal string with one decimal place.
 * Calculates the difference in months between the given start date and now,
 * then converts to years.
 *
 * @param startDate - The date when experience began (e.g., new Date(2022, 7) for August 2022)
 * @returns A string representing years with one decimal place, e.g. "2.8"
 */
export function calculateExperience(startDate: Date): string {
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());
  const years = totalMonths / 12;
  return years.toFixed(1);
}
