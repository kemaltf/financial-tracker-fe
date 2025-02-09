import { IconMessageCircle, IconSelector, IconSettings, IconTrash } from '@tabler/icons-react';
import { Flex, Menu, rem, Text, UnstyledButton } from '@mantine/core';
import classes from './styles/Navbar.module.css';

export const MenuComponent = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton w="100%">
          <Flex w="100%" justify="space-between" align="center">
            <Flex direction="column" align="start" gap={2}>
              <Text className={classes.team}>Untitled UI Team</Text>
              <Text fz={10} fw={400} c="gray">
                shinthantequi@gmail.com
              </Text>
            </Flex>

            <IconSelector size={18} />
          </Flex>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}>
          Messages
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>

        <Menu.Item
          color="red"
          leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
        >
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Menu;
