import React, { useEffect } from 'react'; // Removed useState as we are not displaying message on UI directly
import Dashboard from './components/Dashboard'; // Now importing Dashboard without commenting it out

function App() {
  useEffect(() => {
    // Your actual Render backend URL
    const backendUrl = 'https://market-oracle-backend.onrender.com'; 

    fetch(backendUrl) 
      .then(response => response.json())
      .then(data => {
        console.log('Backend connection successful:', data.message); // Log success message to console
      })
      .catch(error => {
        console.error('Error fetching backend status:', error); // Log any errors to console
      });
  }, []);

  return (
    // This will render your original Dashboard component
    <Dashboard />
  );
}

export default App;
