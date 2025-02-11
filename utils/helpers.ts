import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'; // ES module import

import timezone from 'dayjs/plugin/timezone'; // For time zone handling
import utc from 'dayjs/plugin/utc'; // For UTC handling

// Apply the plugins
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(localizedFormat);

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
export const isZero = (value: number): boolean => {
  return value === 0;
};

export const formatExchage = (number: number, locales: string) => {
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

// Function to set locale
export const setLocale = (locale: string) => {
  dayjs.locale(locale); // Set locale globally
};

// Function to parse the date string into a dayjs object
export const parseDate = (dateString: string, locale: string = 'en'): dayjs.Dayjs => {
  setLocale(locale); // Set locale for the specific operation
  return dayjs(dateString);
};

// Function to format Date to custom format (e.g., 'MM/DD/YYYY')
export const formatDate = (
  date: dayjs.Dayjs,
  format: string = 'MM/DD/YYYY',
  locale: string = 'en'
): string => {
  setLocale(locale); // Set locale for the specific operation
  return date.format(format);
};
// Function to get a readable date (e.g., 'February 1, 2025')
export const getReadableDate = (
  date: dayjs.Dayjs,
  locale: string = 'en',
  format: string = 'MMMM D, YYYY'
): string => {
  setLocale(locale); // Set locale for the specific operation
  return date.format(format);
};

// Function to format the time portion of the date (e.g., '08:05 AM')
export const getTime = (date: dayjs.Dayjs, locale: string = 'en'): string => {
  setLocale(locale); // Set locale for the specific operation
  return date.format('hh:mm A');
};

// Helper function to convert date to different formats
export const convertDate = (
  dateString: string,
  format: string = 'MM/DD/YYYY',
  locale: string = 'en'
): string => {
  const date = parseDate(dateString, locale);
  return formatDate(date, format, locale);
};

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Pastikan tidak melebihi MB
  const formattedSize = parseFloat((bytes / k ** i).toFixed(decimals));

  return `${formattedSize} ${sizes[i]}`;
}
