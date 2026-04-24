import React from 'react';

// Helper to render tree branches recursively using ASCII
const renderTree = (nodeMap, depth = 0, isLast = true, prefix = '') => {
  const keys = Object.keys(nodeMap).sort();
  return keys.map((key, index) => {
    const isCurrentLast = index === keys.length - 1;
    const branch = depth === 0 ? '' : (isLast ? '└── ' : '├── ');
    const newPrefix = depth === 0 ? '' : prefix + (isLast ? '    ' : '│   ');
    
    return (
      <div key={key + depth + index}>
        <div>
          <span className="ascii-branch">{depth > 0 ? prefix + branch : ''}</span>
          <span className="node-label">{key}</span>
        </div>
        {Object.keys(nodeMap[key]).length > 0 && (
          <div className="tree-node">
            {renderTree(nodeMap[key], depth + 1, isCurrentLast, newPrefix)}
          </div>
        )}
      </div>
    );
  });
};

function ResultPanel({ data }) {
  const { 
    user_id, email_id, college_roll_number, 
    hierarchies, invalid_entries, duplicate_edges, summary 
  } = data;

  return (
    <section className="panel result-panel">
      <h2 className="panel-title">Response Dashboard</h2>
      
      {/* Identity Block */}
      <div className="pill-row">
        <span className="pill identity">ID: {user_id}</span>
        <span className="pill identity">Email: {email_id}</span>
        <span className="pill identity">Roll: {college_roll_number}</span>
      </div>

      {/* Hierarchies */}
      <div className="tree-container">
        {hierarchies.length === 0 ? (
           <div style={{color: 'var(--text-secondary)'}}>No valid trees or cycles found.</div>
        ) : (
          hierarchies.map((h, i) => (
            <div key={i} style={{ marginBottom: '1.5rem', borderBottom: i < hierarchies.length - 1 ? '1px dashed var(--surface-border)' : 'none', paddingBottom: i < hierarchies.length - 1 ? '1rem' : '0' }}>
              <div className="tree-root">
                Root: {h.root}
                {h.has_cycle ? (
                  <span className="badge cycle">🔁 CYCLE DETECTED</span>
                ) : (
                  <span className="badge depth">DEPTH: {h.depth}</span>
                )}
              </div>
              <div className="tree-render">
                {renderTree({ [h.root]: h.tree })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invalid & Duplicates */}
      {(invalid_entries?.length > 0 || duplicate_edges?.length > 0) && (
        <div style={{marginBottom: '1.5rem'}}>
          {invalid_entries?.length > 0 && (
            <div className="pill-row">
              <span style={{fontSize: '0.8rem', color:'var(--text-secondary)', marginRight: '8px', paddingTop: '4px'}}>INVALID:</span>
              {invalid_entries.map((entry, i) => (
                <span key={`inv-${i}`} className="pill invalid">{entry}</span>
              ))}
            </div>
          )}
          {duplicate_edges?.length > 0 && (
            <div className="pill-row">
               <span style={{fontSize: '0.8rem', color:'var(--text-secondary)', marginRight: '8px', paddingTop: '4px'}}>DUPLICATES:</span>
              {duplicate_edges.map((entry, i) => (
                <span key={`dup-${i}`} className="pill duplicate">{entry}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="summary-bar">
        <div className="stat-block">
          <div className="stat-label">Total Trees</div>
          <div className="stat-value">{summary.total_trees}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Total Cycles</div>
          <div className="stat-value">{summary.total_cycles}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Largest Tree Root</div>
          <div className="stat-value">{summary.largest_tree_root || "N/A"}</div>
        </div>
      </div>
    </section>
  );
}

export default ResultPanel;
