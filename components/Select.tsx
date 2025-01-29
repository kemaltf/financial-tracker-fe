import { useEffect, useRef, useState } from 'react';
import {
  Combobox,
  ComboboxOptionProps,
  ComboboxProps,
  Loader,
  ScrollArea,
  TextInput,
  TextInputProps,
  useCombobox,
} from '@mantine/core';
import { useIntersection } from '@mantine/hooks';

interface Data {
  value: string;
  label: string;
}

interface InfiniteScrollSelectProps {
  data: Data[];
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
}

const InfiniteScrollSelect: React.FC<InfiniteScrollSelectProps> = ({
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
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({ root: loadMoreRef.current, threshold: 1 });

  const combobox = useCombobox({
    onDropdownOpen: () => {
      if (data.length === 0 && onBottomReached) {
        onBottomReached();
      }
    },
    onDropdownClose: () => {},
  });

  const [selectedLabel, setSelectedLabel] = useState('');

  // Update selectedLabel setiap kali value berubah
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
          placeholder="Pilih opsi..."
          value={selectedLabel} // Menampilkan label, bukan value
          defaultValue={defaultValue}
          error={error}
          checked={checked}
          onChange={(event) => {
            const inputValue = event.currentTarget.value;
            setSelectedLabel(inputValue);
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

      <Combobox.Dropdown>
        <ScrollArea.Autosize mah={mah}>
          {data.length > 0 ? (
            data.map((item) => (
              <Combobox.Option
                key={item.value}
                onClick={() => {
                  setSelectedLabel(item.label);
                  onChange?.(item.value);
                }}
                {...optionProps}
                value={item.value}
              >
                {item.label}
              </Combobox.Option>
            ))
          ) : (
            <div style={{ padding: '10px', textAlign: 'center' }}>Tidak ada data</div>
          )}
          <div ref={ref} style={{ padding: '10px', textAlign: 'center' }}>
            {loading && <Loader size="sm" />}
          </div>
        </ScrollArea.Autosize>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default InfiniteScrollSelect;
