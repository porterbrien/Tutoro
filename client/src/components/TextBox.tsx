import React, { ChangeEvent } from 'react';

interface TextBoxProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  value,
  placeholder = 'Enter text...',
  onChange,
  type = 'text'
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      style={{
        padding: '8px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%'
      }}
    />
  );
};

export default TextBox;