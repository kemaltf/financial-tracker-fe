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

interface ProductData {
  value: string;
  label: string;
  image?: string;
  sku: string;
  stock: number;
  price: number;
}

interface InfiniteScrollSelectProps {
  data: ProductData[];
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({ root: containerRef.current, threshold: 1 });

  const combobox = useCombobox({
    onDropdownOpen: () => {},
    onDropdownClose: () => {},
  });

  const [selectedLabel, setSelectedLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State untuk pencarian
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null); // Untuk menyimpan produk yang dipilih

  // Filter data berdasarkan query pencarian
  const filteredData = searchable
    ? data.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : data;

  useEffect(() => {
    const selectedItem = data.find((item) => item.value === value);
    setSelectedProduct(selectedItem || null); // Mengatur produk yang dipilih
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
                setSelectedProduct(item); // Set produk yang dipilih
                onChange?.(item.value);
                combobox.closeDropdown(); // Menutup dropdown setelah memilih opsi
              }}
              {...optionProps}
              value={item.value}
            >
              <Group gap="sm" wrap="nowrap">
                <Image src={item.image} alt={item.label} width={50} height={50} />
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
        <div ref={ref} style={{ padding: '10px', textAlign: 'center', background: 'red' }}>
          {loading && <Loader size="sm" />}
        </div>
      </Combobox.Dropdown>

      {selectedProduct && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
          <Image src={selectedProduct.image} alt={selectedProduct.label} width={50} height={50} />
          <Stack gap={0} style={{ marginLeft: '10px' }}>
            <Text>{selectedProduct.label}</Text>
            <Text size="sm" color="dimmed">
              SKU: {selectedProduct.sku}
            </Text>
            <Text size="sm" color="dimmed">
              Stok: {selectedProduct.stock}
            </Text>
            <Text size="sm" color="green">
              Harga: ${selectedProduct.price}
            </Text>
          </Stack>
        </div>
      )}
    </Combobox>
  );
};

export default SelectProduct;
