import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMinus } from '@tabler/icons-react';
import { Badge, Collapse, Flex, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLinkType } from './constant';
import classes from './styles/Navbar.module.css';

export const Folder = ({ title, icon: Icon, files }: NavLinkType) => {
  const [opened, { toggle }] = useDisclosure(true);
  const pathname = usePathname();

  return (
    <Flex direction="column" align="start" w="100%">
      <UnstyledButton
        h={36.15}
        style={{
          justifyContent: 'space-between',
        }}
        w="100%"
        className={classes.navlink}
        onClick={toggle}
      >
        <Flex align="center" gap={10}>
          <Icon size={20} />
          <Text className={classes.title} lts={-0.5}>
            {title}
          </Text>
        </Flex>
        {opened && <IconMinus />}
      </UnstyledButton>
      <Collapse w="100%" pl={30} in={opened}>
        <Flex w="100%" py={14} direction="column" align="start" gap={10}>
          {files.map((file, index) => (
            <Link
              data-active={pathname === file.link}
              key={index}
              className={classes.subNavLink}
              href={file.link}
              style={{ textDecoration: 'none' }}
            >
              <Text lts={-0.5}>{file.name}</Text>
              {file?.noti && (
                <Badge radius={6} className={classes.noti} px={6}>
                  {file.noti}
                </Badge>
              )}
            </Link>
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};
