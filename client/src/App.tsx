import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage('Error: ' + err.message));
  }, []);

  return (
    <div className="App">
      <h1>Frontend + Backend Connected</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
