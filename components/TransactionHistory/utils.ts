import dayjs from 'dayjs';

export const getLast12Months = () => {
  return Array.from({ length: 12 })
    .map((_, i) => {
      const date = dayjs().subtract(i, 'month');
      return { label: date.format('MMMM'), value: date.format('YYYY-MM') };
    })
    .reverse();
};
