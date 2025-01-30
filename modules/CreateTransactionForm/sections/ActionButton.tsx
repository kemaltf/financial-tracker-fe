import React from 'react';
import { TransactionFormValues } from '..';
import { Button, Group } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type Props = {
  isMobile: boolean;
  form: UseFormReturnType<TransactionFormValues>;
  onClose: () => void;
};

export function ActionButton({ isMobile, form, onClose }: Props) {
  return (
    <Group
      justify="space-between"
      mt="md"
      w="100%"
      {...(isMobile && {
        pos: 'fixed',
        bottom: 0,
        bg: 'white',
        left: 0,
        p: 'md',
      })}
    >
      <Button variant="outline" onClick={() => form.reset()}>
        Reset
      </Button>

      <Group>
        <Button variant="filled" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </Group>
  );
}
