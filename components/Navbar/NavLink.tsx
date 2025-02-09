import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text } from '@mantine/core';
import { NavLinkType } from './constant';
import classes from './styles/Navbar.module.css';

export const NavLink = ({ title, icon: Icon, link }: NavLinkType) => {
  const pathname = usePathname();
  return (
    <Link
      data-active={pathname === link}
      className={classes.navlink}
      href={link}
      style={{ textDecoration: 'none' }}
    >
      <Icon size={20} />
      <Text className={classes.title} lts={-0.5}>
        {title}
      </Text>
    </Link>
  );
};
