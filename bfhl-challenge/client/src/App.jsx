import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async (inputJsonObj) => {
    setLoading(true);
    setError(null);
    setData(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputJsonObj)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error processing request');
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="top-bar">
        <div className="logo">BFHL</div>
        <div className="user-indicator">
            {data ? data.user_id.toUpperCase() : 'USER_ID PENDING'}
        </div>
      </header>

      <main className="main-content">
        <InputPanel onProcess={handleProcess} loading={loading} error={error} />
        {data && <ResultPanel data={data} />}
      </main>
    </div>
  );
}

export default App;
