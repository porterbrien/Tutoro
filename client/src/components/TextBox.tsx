import React, { useState, ChangeEvent } from 'react';

interface TextBoxProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const TextBox: React.FC<TextBoxProps> = ({ value, placeholder = 'Enter text...', onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

    return (
        <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
    );
};

export default TextBox;