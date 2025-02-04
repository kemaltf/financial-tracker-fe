import React from 'react';
import { Button, Grid, Group } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { TransactionFormValues } from '../form';

type Props = {
  isMobile: boolean;
  form: UseFormReturnType<TransactionFormValues>;
  onClose: () => void;
};

export function ActionButton({ isMobile, form, onClose }: Props) {
  return (
    <Grid pb="md">
      <Grid.Col span={12} p={0}>
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
      </Grid.Col>
    </Grid>
  );
}
