import { useState } from 'react';

function InputPanel({ onProcess, loading, error }) {
  const defaultRaw = "A->B, A->C, B->D\nX->Y, Y->Z, Z->X\nhello, G->H, G->H, G->I";
  const [inputVal, setInputVal] = useState(defaultRaw);
  
  const handleSubmit = () => {
    try {
      let parsed = {};
      if (inputVal.trim().startsWith('{')) {
        parsed = JSON.parse(inputVal);
      } else {
        // Extract plain elements split by commas or newlines, remove quotes/whitespace
        const rawArray = inputVal
          .split(/[\n,]+/)
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(s => s.length > 0);
        parsed = { data: rawArray };
      }
      onProcess(parsed);
    } catch (e) {
      alert("Invalid input format");
    }
  };

  return (
    <section className="panel">
      <h2 className="panel-title">Data Input</h2>
      <textarea 
        className="input-area"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        spellCheck="false"
      />
      <button 
        className="submit-btn" 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Process →'}
      </button>
      
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}
    </section>
  );
}

export default InputPanel;
