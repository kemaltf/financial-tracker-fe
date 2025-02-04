import { forwardRef } from 'react';
import { Textarea, TextareaProps } from '@mantine/core';

interface TextAreaWithCounterProps extends TextareaProps {
  maxLength?: number;
}

const TextAreaWithCounter = forwardRef<HTMLTextAreaElement, TextAreaWithCounterProps>(
  ({ maxLength = 500, value, onChange, ...props }, ref) => {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '130px' }}>
        <Textarea
          ref={ref}
          value={value}
          onChange={onChange}
          minRows={4}
          maxRows={10}
          {...props}
          styles={{
            input: {
              paddingBottom: '30px', // Tambahkan ruang untuk counter
              position: 'relative',
            },
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '12px',
            fontSize: '12px',
            color: value && value.toString().length >= maxLength ? 'red' : 'gray',
          }}
        >
          {value ? value.toString().length : 0} / {maxLength}
        </div>
        <style>
          {`
            textarea::-webkit-scrollbar {
              width: 6px;
            }

            textarea::-webkit-scrollbar-thumb {
              background-color: #888;
              border-radius: 4px;
            }

            textarea::-webkit-scrollbar-thumb:hover {
              background-color: #555;
            }
          `}
        </style>
      </div>
    );
  }
);

TextAreaWithCounter.displayName = 'TextAreaWithCounter';

export default TextAreaWithCounter;
