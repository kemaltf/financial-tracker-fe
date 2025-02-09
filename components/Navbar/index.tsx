import { IconHome2 } from '@tabler/icons-react';
import { Divider, Flex, ScrollArea, Stack } from '@mantine/core';
import { navlinks, others } from './constant';
import { Folder } from './Folder';
import { MenuComponent } from './Menu';
import { NavLink } from './NavLink';

export default function Navbar() {
  return (
    <Stack h="100%" gap={20} px="md" py="lg">
      <Flex gap={8} w="100%" align="center">
        <IconHome2 size={50} color="black" />
        <MenuComponent />
      </Flex>

      <ScrollArea h="100%">
        <Flex h="100%" gap={4} direction="column" align="start">
          {navlinks.map((navlink, index) => {
            return navlink.files.length > 0 ? (
              <Folder key={index} {...navlink} />
            ) : (
              <Flex w="100%" direction="column" align="start" key={index}>
                <NavLink {...navlink} />
                {navlink.hasBorderBottom && <Divider my={10} w="100%" />}
              </Flex>
            );
          })}
        </Flex>
      </ScrollArea>

      <Flex w="100%" direction="column" align="start" gap={6}>
        {others.map((otherLink, index) => (
          <NavLink key={index} {...otherLink} />
        ))}
      </Flex>
    </Stack>
  );
}
