/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns True if the value is null or undefined, false otherwise.
 */
export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};
/**
 * Checks if a value is zero.
 * @param value - The value to check.
 * @returns True if the value is zero, false otherwise.
 */
export const isZero = (value: any): boolean => {
  return value === 0;
};
