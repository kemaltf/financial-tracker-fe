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
import { ImageUpload } from '@/components/ImageUpload';
import { MultiSelectCreatable } from '@/components/MultiSelectCreateable';
import { useLazyGetVariantTypesQuery } from '@/lib/features/api/features/variant-type-endpoints';
import { MAX_VARIANT_TYPES, ProductFormType } from '../form';

type Props = {
  form: ProductFormType;
};

export const Variant = ({ form }: Props) => {
  const [getVariantType, { data }] = useLazyGetVariantTypesQuery();
  const {
    variantValues,
    isVariantMode,
    variantTypeSelections,
    storeId,
    variants,
    // variationOptions,
  } = form.values;
  // const product = useSelector(
  //   (state: RootState) =>
  //     (
  //       state.api.queries[`getProduct({"id":${id}})`]?.data as
  //         | ApiResponse<CreateProductResponse>
  //         | undefined
  //     )?.data
  // );

  const memoizedVariantTypeIdSelections = useMemo(
    () => variantTypeSelections,
    [JSON.stringify(variantTypeSelections)]
  );
  const memoizedVariantValues = useMemo(() => variantValues, [JSON.stringify(variantValues)]);
  const memoizedVariants = useMemo(() => variants, [JSON.stringify(variants)]);

  // COMBINE VARIANTS
  const generatedVariants = useMemo(() => {
    // jika bukan variant mode maka return []
    if (!isVariantMode || memoizedVariantTypeIdSelections.length === 0) {
      return [];
    }

    // memoizedVariantTypeIdSelections =>  variant type yang di pilih ['1','2'] ID-nya
    // Pastikan tidak ada nilai null dalam memoizedVariantTypeIdSelections = [1, null]
    const isValidSelections = memoizedVariantTypeIdSelections.every(
      (id) => id !== null && id !== undefined
    );

    if (!isValidSelections) {
      return []; // Jika ada nilai null, return empty array
    }

    // Ambil variantValues berdasarkan index, bukan berdasarkan nama variant
    // memoizedVariantValues => variant values object {'0': ['yellow','blue'], '1':['M']}
    const variantLists = memoizedVariantTypeIdSelections.map(
      (_, index) => memoizedVariantValues[index] ?? []
    ); // [['yellow','blue'],['M','L']]

    // create combination
    // [[yellow, M], [blue, M]]
    const combinations = variantLists.reduce<string[][]>((acc, values) => {
      if (acc.length === 0) {
        return values.map((v) => [v]);
      }
      return acc.flatMap((prev) => values.map((v) => [...prev, v]));
    }, []);

    return combinations.map((values, index) => {
      // Mapping ID ke Name dari data
      const variantOptions = Object.fromEntries(
        values.map((value, i) => {
          // Cari variant type berdasarkan ID yang dipilih
          const variantType = data?.data?.find(
            (v) => String(v.id) === memoizedVariantTypeIdSelections[i]
          );

          return [variantType?.name ?? `Option ${i + 1}`, value];
        })
      );

      // Ambil existing variant dari form
      const existingVariants = form.values.variants ?? [];
      const existingVariant = existingVariants.find(
        (variant) => JSON.stringify(variant.variantOptions) === JSON.stringify(variantOptions)
      );

      return {
        id: index + 1,
        variantOptions,
        price: existingVariant?.price ?? 0, // Gunakan harga lama jika ada
        stock: existingVariant?.stock ?? 0,
        weight: existingVariant?.weight ?? 0,
        sku: existingVariant?.sku ?? '',
        image: existingVariant?.image ?? [],
      };
    });
  }, [memoizedVariantValues, isVariantMode, memoizedVariantTypeIdSelections]);

  const variantTypesComponent = useMemo(() => {
    return variantTypeSelections.map((_, index) => (
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
            data={[]}
            creatable
            label={`Variant Values ${data?.data?.find((v) => v.id.toString() === variantTypeSelections[index])?.name || 'Unknown'}`}
            placeholder="Select or create items..."
          />

          {index !== 0 && (
            <Button
              variant="light"
              color="red"
              onClick={() => {
                form.setValues({
                  variantTypeSelections: variantTypeSelections.filter((_, i) => i !== index),
                  variantValues: Object.fromEntries(
                    Object.entries(variantValues).filter(([key]) => Number(key) !== index)
                  ),
                });
              }}
            >
              <IconTrash size={16} />
            </Button>
          )}
          {variantTypeSelections.length < MAX_VARIANT_TYPES &&
            index === variantTypeSelections.length - 1 && (
              <Button
                variant="light"
                onClick={() => form.insertListItem('variantTypeSelections', [{ id: -1, name: '' }])}
              >
                <IconPlus size={16} />
              </Button>
            )}
        </Group>
      </Card>
    ));
  }, [memoizedVariantTypeIdSelections, memoizedVariantValues, MAX_VARIANT_TYPES]);

  // Reset variants jika bukan variant mode
  useEffect(() => {
    if (!isVariantMode) {
      form.setValues({
        variants: [],
        variantTypeSelections: [],
        variantValues: {},
      });
    }
  }, [isVariantMode]);

  const tableBodyMemo = useMemo(() => {
    return generatedVariants?.map((variant, index) => (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        {Object.entries(variant.variantOptions).map(([key, value]) => (
          <Table.Td key={key}>{value}</Table.Td>
        ))}
        <Table.Td>
          <NumberInput
            leftSection="Rp"
            placeholder="10,000,000"
            {...form.getInputProps(`variants.${index}.price`)}
            required
            thousandSeparator
            hideControls
            allowNegative={false}
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            {...form.getInputProps(`variants.${index}.stock`)}
            placeholder="Stock"
            hideControls
            allowNegative={false}
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            leftSection="gr"
            {...form.getInputProps(`variants.${index}.weight`)}
            placeholder="Weight"
            hideControls
            allowNegative={false}
          />
        </Table.Td>
        <Table.Td>
          <TextInput
            {...form.getInputProps(`variants.${index}.sku`)}
            placeholder="SKU"
            value={form.values.variants?.[index]?.sku || ''}
          />
        </Table.Td>
        <Table.Td style={{ width: '100px' }}>
          <ImageUpload
            {...form.getInputProps(`variants.${index}.image`)}
            maxImages={1}
            predefinedBoxes
            disabled={!form.values.storeId}
            gridColSetting={{ base: 12 }}
          />
        </Table.Td>
      </Table.Tr>
    ));
  }, [generatedVariants, memoizedVariants]);

  useEffect(() => {
    if (isVariantMode) {
      form.setValues({ variants: generatedVariants });
    }
    // Cek apakah data sudah sama sebelum update
  }, [generatedVariants, form.values.isVariantMode]);

  useEffect(() => {
    getVariantType({
      storeId: form.values.storeId,
    });
  }, [storeId]);

  return (
    <Stack>
      <Switch
        label="Use Variants"
        checked={isVariantMode}
        disabled={!storeId}
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

      {isVariantMode && (
        <Stack>
          <Group>{variantTypesComponent}</Group>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No</Table.Th>
                {variantTypeSelections.map((variant, index) => (
                  <Table.Th key={index}>
                    {data?.data?.find((v) => v.id.toString() === variant)?.name}
                  </Table.Th>
                ))}
                <Table.Th>Price</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Weight (gr)</Table.Th>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Image</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableBodyMemo}</Table.Tbody>
          </Table>
        </Stack>
      )}
    </Stack>
  );
};
