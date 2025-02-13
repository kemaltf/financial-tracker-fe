import { useEffect, useRef, useState } from 'react';
import {
  Combobox,
  ComboboxOptionProps,
  ComboboxProps,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  TextInput,
  TextInputProps,
  useCombobox,
} from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { Product } from '@/lib/features/api/types/product';

interface InfiniteScrollSelectProps {
  data: Product[];
  loading?: boolean;
  onBottomReached?: () => void;
  onChange?: (value: string) => void;
  mah?: number | string;
  textInputProps?: TextInputProps;
  containerProps?: ComboboxProps;
  optionProps?: ComboboxOptionProps;
  checked?: boolean;
  defaultValue?: string;
  error?: string;
  onBlur?: () => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  children?: React.ReactNode; // Untuk custom dropdown
  searchable?: boolean; // Menambahkan props searchable
  disabled?: boolean; // Add disabled prop
  selectedProductIds?: string[]; // Add selectedProductIds prop
}

const SelectProduct: React.FC<InfiniteScrollSelectProps> = ({
  data = [],
  loading = false,
  onBottomReached,
  onChange,
  mah = 200,
  textInputProps = {},
  containerProps = {},
  optionProps = {},
  checked,
  defaultValue,
  error,
  onBlur,
  onFocus,
  value,
  searchable = false, // Default tidak searchable
  disabled = false, // Default not disabled
  selectedProductIds = [], // Default empty array
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({ root: containerRef.current, threshold: 1 });

  const combobox = useCombobox({
    onDropdownOpen: () => {},
    onDropdownClose: () => {},
  });

  const [selectedLabel, setSelectedLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State untuk pencarian

  // Filter data berdasarkan query pencarian
  const filteredData = searchable
    ? data.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : data;

  useEffect(() => {
    const selectedItem = data.find((item) => item.value === value);
    setSelectedLabel(selectedItem ? selectedItem.label : '');
  }, [value, data]);

  useEffect(() => {
    if (entry?.isIntersecting && onBottomReached && !loading) {
      onBottomReached();
    }
  }, [entry, onBottomReached, loading]);

  return (
    <Combobox store={combobox} withinPortal={false} {...containerProps}>
      <Combobox.Target>
        <TextInput
          placeholder="Pilih produk..."
          value={selectedLabel}
          defaultValue={defaultValue}
          error={error}
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            setSelectedLabel(event.currentTarget.value);
            if (searchable) {
              setSearchQuery(event.currentTarget.value); // Update search query saat mengetik
            }
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={(event) => {
            combobox.openDropdown();
            onFocus?.(event);
          }}
          onBlur={() => {
            combobox.closeDropdown();
            onBlur?.();
          }}
          {...textInputProps}
        />
      </Combobox.Target>

      <Combobox.Dropdown mah={mah} ref={containerRef} style={{ overflowY: 'auto' }}>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <Combobox.Option
              key={`${item.value}-${index}`}
              onClick={() => {
                setSelectedLabel(item.label);
                onChange?.(item.value);
                combobox.closeDropdown(); // Menutup dropdown setelah memilih opsi
              }}
              {...optionProps}
              value={item.value}
              disabled={selectedProductIds.includes(item.value) || item.disabled} // Disable if already selected
              ref={index === filteredData.length - 1 ? ref : null}
            >
              <Group gap="sm" wrap="nowrap">
                <Image
                  src={item.image || '/placeholder-image.jpg'}
                  alt={item.label}
                  width={50}
                  height={50}
                />
                <Stack gap={0}>
                  <Text>{item.label}</Text>
                  <Text size="sm" color="dimmed">
                    SKU: {item.sku}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Stok: {item.stock}
                  </Text>
                  <Text size="sm" color="green">
                    Harga: ${item.price}
                  </Text>
                </Stack>
              </Group>
            </Combobox.Option>
          ))
        ) : (
          <div style={{ padding: '10px', textAlign: 'center' }}>Tidak ada data</div>
        )}

        {loading && <Loader size="sm" />}
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default SelectProduct;
