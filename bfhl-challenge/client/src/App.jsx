import { useState } from 'react';
import { SignJWT } from 'jose';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import IdentityConfig from './components/IdentityConfig';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identityConfig, setIdentityConfig] = useState({
    user_id: '',
    email_id: '',
    college_roll_number: ''
  });

  const handleProcess = async (inputJsonObj) => {
    setLoading(true);
    setError(null);
    setData(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      let token = null;
      if (identityConfig.user_id || identityConfig.email_id || identityConfig.college_roll_number) {
        const secret = new TextEncoder().encode('bfhl-secret-key');
        token = await new SignJWT({ 
          user_id: identityConfig.user_id, 
          email_id: identityConfig.email_id, 
          college_roll_number: identityConfig.college_roll_number 
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .sign(secret);
      }

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: headers,
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
        <IdentityConfig config={identityConfig} setConfig={setIdentityConfig} />
        <InputPanel onProcess={handleProcess} loading={loading} error={error} />
        {data && <ResultPanel data={data} />}
      </main>
    </div>
  );
}

export default App;
