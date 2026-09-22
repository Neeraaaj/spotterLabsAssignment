import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch('http://localhost:8000/api/health/')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('backend not reachable'));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Backend status: {status}</h1>
    </div>
  );
}

export default App;