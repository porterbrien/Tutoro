import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/Button';
import TextBox from './components/TextBox';

type Field = {
  name: string;
  label: string;
  value: string;
};

function App() {
  const [message, setMessage] = useState('');
  const [fields, setFields] = useState<Field[]>([
    { name: 'f_name', label: 'First Name', value: '' },
    { name: 'l_name', label: 'Last Name', value: '' },
    { name: 'phone_num', label: 'Phone Number', value: '' }
]);


  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage('Error: ' + err.message));
  }, []);

  const handleChange = (name: string, value: string) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

const handleSave = async () => {
  const payload = fields.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {} as Record<string, string>);

  console.log('Saving to database:', payload);

  try {
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save user');
    }

    const data = await response.json();
    console.log('User saved:', data);
    setMessage('User saved successfully!');

    setFields((prev) =>
      prev.map((field) => ({ ...field, value: '' }))
    );
  } catch (error) {
    console.error('❌ Error saving user:', error);
    setMessage('Error saving user');
  }
};

  return (
    <div className="App">
      <h1>Tutoro Dev</h1>
      <p>{message}</p>

      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: '12px' }}>
          <label>{field.label}</label>
          <TextBox
            value={field.value}
            onChange={(val) => handleChange(field.name, val)}
            placeholder={field.label}
          />
        </div>
      ))}
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}

export default App;
