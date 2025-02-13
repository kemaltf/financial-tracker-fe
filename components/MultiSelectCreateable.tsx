import { useState } from 'react';
import { CheckIcon, Combobox, Group, Input, Pill, PillsInput, useCombobox } from '@mantine/core';

interface MultiSelectCreatableProps {
  label?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  data?: string[];
  disabled?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  placeholder?: string;
}

export function MultiSelectCreatable({
  label,
  value = [],
  onChange,
  data = [],
  disabled = false,
  creatable = true,
  placeholder = 'Select values',
}: MultiSelectCreatableProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [options, setOptions] = useState(data);
  const exactOptionMatch = options.some((item) => item.toLowerCase() === search.toLowerCase());

  const handleValueSelect = (val: string) => {
    setSearch('');
    let newValue = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];

    if (val === '$create' && creatable) {
      newValue = [...value, search];
      setOptions((prev) => [...prev, search]);
    }

    onChange?.(newValue);
  };

  const handleValueRemove = (val: string) => {
    onChange?.(value.filter((v) => v !== val));
  };

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <Input.Wrapper label={label}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal>
        <Combobox.DropdownTarget>
          <PillsInput disabled={disabled} onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {values}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  disabled={disabled}
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder={placeholder}
                  onChange={(event) => {
                    setSearch(event.currentTarget.value);
                    combobox.updateSelectedOptionIndex();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {filteredOptions.map((item) => (
              <Combobox.Option value={item} key={item}>
                <Group gap="sm">
                  {value.includes(item) && <CheckIcon size={12} />}
                  <span>{item}</span>
                </Group>
              </Combobox.Option>
            ))}

            {!exactOptionMatch && search.trim().length > 0 && creatable && (
              <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
            )}

            {filteredOptions.length === 0 && search.trim().length > 0 && (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
}
