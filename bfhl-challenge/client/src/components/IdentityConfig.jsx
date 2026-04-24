import React from 'react';

function IdentityConfig({ config, setConfig }) {
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  return (
    <section className="panel">
      <h2 className="panel-title">Dynamic Identity Configurator (JWT)</h2>
      <div className="input-group-row">
        <div className="input-col">
          <label className="input-label">User ID</label>
          <input 
            type="text" 
            name="user_id"
            className="config-input"
            value={config.user_id}
            onChange={handleChange}
            placeholder="shubashismete_14082003"
          />
        </div>
        <div className="input-col">
          <label className="input-label">Email ID</label>
          <input 
            type="email" 
            name="email_id"
            className="config-input"
            value={config.email_id}
            onChange={handleChange}
            placeholder="shubashis.mete@srm.edu.in"
          />
        </div>
        <div className="input-col">
          <label className="input-label">Roll Number</label>
          <input 
            type="text" 
            name="college_roll_number"
            className="config-input"
            value={config.college_roll_number}
            onChange={handleChange}
            placeholder="RA1911026010000"
          />
        </div>
      </div>
      <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px'}}>
        Note: The configured identities here will be dynamically signed into a JWT before submission to bypass the hardcoded server limits!
      </p>
    </section>
  );
}

export default IdentityConfig;
