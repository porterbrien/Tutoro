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
    { name: 'firstname', label: 'First Name', value: '' },
    { name: 'lastname', label: 'Last Name', value: '' },
    { name: 'gender', label: 'Gender', value: '' },
  ]);

  useEffect(() => {
    fetch('http://localhost:3001/')
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

  const handleSave = () => {
    const payload = fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as Record<string, string>);

    console.log('Saving to database:', payload);
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
