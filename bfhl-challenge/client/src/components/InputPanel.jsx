import { useState } from 'react';

const exampleData = {
  "data": ["A->B","A->C","B->D","X->Y","Y->Z","Z->X","hello","G->H","G->H","G->I"]
};

function InputPanel({ onProcess, loading, error }) {
  const [inputVal, setInputVal] = useState(JSON.stringify(exampleData, null, 2));
  
  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(inputVal);
      onProcess(parsed);
    } catch (e) {
      alert("Invalid JSON format");
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
