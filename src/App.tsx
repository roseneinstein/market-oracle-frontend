import React, { useState, useEffect } from 'react';
// import Dashboard from './components/Dashboard'; // We will re-add this later

function App() {
  const [backendMessage, setBackendMessage] = useState('Loading backend status...');

  useEffect(() => {
    // REPLACE https://market-oracle-backend.onrender.com with your actual Render backend URL
    fetch('https://market-oracle-backend.onrender.com') 
      .then(response => response.json())
      .then(data => {
        setBackendMessage(`Backend status: ${data.message}`);
      })
      .catch(error => {
        console.error('Error fetching backend status:', error);
        setBackendMessage('Backend connection error or not running.');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Market Oracle Frontend</h1>
      <p>{backendMessage}</p>
      {/* <Dashboard /> */}
      <p>Once backend is fully integrated, Dashboard will appear here.</p>
    </div>
  );
}

export default App;
