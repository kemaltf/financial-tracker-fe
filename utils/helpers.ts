import dayjs from 'dayjs';

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

export const formatRupiah = (number: number, locales: string) => {
  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const stringToDate = (dateString: string): Date | undefined => {
  const date = dayjs(dateString);
  return date.isValid() ? date.toDate() : undefined;
};
