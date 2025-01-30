import { useMediaQuery } from '@mantine/hooks';

export const useDeviceType = () => {
  const isMobile = useMediaQuery('(max-width: 640px)'); // <= 640px (Mobile)
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)'); // 641px - 1024px (Tablet)
  const isLaptop = useMediaQuery('(min-width: 1025px)'); // >= 1025px (Laptop/Desktop)

  return { isMobile, isTablet, isLaptop };
};
