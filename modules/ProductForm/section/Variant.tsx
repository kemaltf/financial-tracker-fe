import React, { useEffect, useMemo } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Table,
  TextInput,
} from '@mantine/core';
import { MultiSelectCreatable } from '@/components/MultiSelectCreateable';
import { useLazyGetVariantTypesQuery } from '@/lib/features/api';
import { MAX_VARIANT_TYPES, ProductFormType } from '../form';

type Props = {
  form: ProductFormType;
};

export const Variant = ({ form }: Props) => {
  const [getVariantType, { data }] = useLazyGetVariantTypesQuery();

  const generatedVariants = useMemo(() => {
    const { variantValues, isVariantMode, variantTypeSelections } = form.values;

    if (!isVariantMode || variantTypeSelections.length === 0) {
      return [];
    }

    // Ambil variantValues berdasarkan index, bukan berdasarkan nama variant
    const variantLists = variantTypeSelections.map((_, index) => variantValues[index] ?? []);

    const combinations = variantLists.reduce<string[][]>((acc, values) => {
      if (acc.length === 0) {
        return values.map((v) => [v]);
      }
      return acc.flatMap((prev) => values.map((v) => [...prev, v]));
    }, []);

    return combinations.map((values, index) => ({
      id: index + 1,
      values,
      price: '',
      stock: 0,
      sku: '',
      imageIds: [],
    }));
  }, [form.values.variantValues, form.values.isVariantMode, form.values.variantTypeSelections]);

  useEffect(() => {
    if (form.values.isVariantMode) {
      form.setValues({ variants: generatedVariants });
    }
    // Cek apakah data sudah sama sebelum update
  }, [generatedVariants, form.values.isVariantMode]);

  useEffect(() => {
    getVariantType({
      storeId: form.values.storeId,
    });
  }, [form.values.storeId]);

  return (
    <Stack>
      <Switch
        label="Use Variants"
        checked={form.values.isVariantMode}
        disabled={!form.values.storeId}
        {...form.getInputProps('isVariantMode', { type: 'checkbox' })} // Pastikan tipe benar
        onChange={(event) => {
          const newValue = event.currentTarget.checked; // Toggle nilai

          form.setFieldValue('isVariantMode', newValue); // Update nilai switch

          if (newValue) {
            form.insertListItem('variantTypeSelections', { id: -1, name: '' });
          } else {
            form.setFieldValue('variantTypeSelections', []); // Hapus semua jika dimatikan
          }
        }}
      />

      {form.values.isVariantMode && (
        <Stack>
          <Group>
            {form.values.variantTypeSelections.map((_, index) => (
              <Card key={index} shadow="sm" p="md" radius="md" withBorder>
                <Group align="end">
                  <Select
                    label="Variant Type"
                    placeholder="Variant Type"
                    data={data?.data?.map((v) => ({ value: v.id.toString(), label: v.name }))}
                    {...form.getInputProps(`variantTypeSelections.${index}`)}
                  />
                  <MultiSelectCreatable
                    {...form.getInputProps(`variantValues.${index}`)}
                    data={['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']}
                    creatable
                    label={`Variant Values ${data?.data?.find((v) => v.id.toString() === form.values.variantTypeSelections[index])?.name || 'Unknown'}`}
                    placeholder="Select or create items..."
                  />

                  {index !== 0 && (
                    <Button
                      variant="light"
                      color="red"
                      onClick={() => {
                        form.setValues({
                          variantTypeSelections: form.values.variantTypeSelections.filter(
                            (_, i) => i !== index
                          ),
                          variantValues: Object.fromEntries(
                            Object.entries(form.values.variantValues).filter(
                              ([key]) => Number(key) !== index
                            )
                          ),
                        });
                      }}
                    >
                      <IconTrash size={16} />
                    </Button>
                  )}
                  {form.values.variantTypeSelections.length < MAX_VARIANT_TYPES &&
                    index === form.values.variantTypeSelections.length - 1 && (
                      <Button
                        variant="light"
                        onClick={() =>
                          form.insertListItem('variantTypeSelections', [{ id: -1, name: '' }])
                        }
                      >
                        <IconPlus size={16} />
                      </Button>
                    )}
                </Group>
              </Card>
            ))}
          </Group>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No</Table.Th>
                {form.values.variantTypeSelections.map((variant, index) => (
                  <Table.Th key={index}>
                    {data?.data?.find((v) => v.id.toString() === variant)?.name}
                  </Table.Th>
                ))}
                <Table.Th>Price</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Image ID</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {generatedVariants?.map((variant, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{index + 1}</Table.Td>
                  {variant.values.map((value, i) => (
                    <Table.Td key={i}>{value}</Table.Td>
                  ))}
                  <Table.Td>
                    <NumberInput
                      leftSection="Rp"
                      placeholder="10,000,000"
                      {...form.getInputProps(`variants?.${index}.price`)}
                      required
                      thousandSeparator
                      hideControls
                      allowNegative={false}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      {...form.getInputProps(`variants?.${index}.stock`)}
                      placeholder="Stock"
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      {...form.getInputProps(`variants?.${index}.sku`)}
                      placeholder="SKU"
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput {...form.getInputProps(`variants?.${index}.imageIds`)} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      )}
    </Stack>
  );
};
