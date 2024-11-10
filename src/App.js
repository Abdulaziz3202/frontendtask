import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepositForm from './DepositForm';
import WebSocketNotification from './WebSocketNotification';
import WithdrawForm from './WithdrawForm';

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // If we already have a token stored, use it to establish WebSocket connection
   // setInterval(() => {
      localStorage.removeItem('authToken')
    //}, 100000);
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleLogin = async () => {
    const email = 'kh@gmail.com';  // Static username
    const password = 'P@ssw0rd';  // Static password

    try {
      const response = await axios.post('https://localhost:5000/api/auth/token', { Email: email, Password: password });

      // Assuming the token is in the 'token' field of the response
      const  token  = response.data.accessToken;

     
      if (token) {
        // Store the token in localStorage for future use
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setStatus('Login successful!');
      } else {
        setStatus('Login failed: No token received.');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setStatus('Login failed: ' + error.response.data.message);
      } else {
        // Network or other errors
        setStatus('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="App">
      <h1>Financial System</h1>

      {authToken ? (
        <>
          <WebSocketNotification authToken={authToken} />
          <DepositForm authToken={authToken} />
          <WithdrawForm authToken={authToken} />
        </>
      ) : (
        <div>
          <h2>Please log in</h2>
          <button onClick={handleLogin}>Login with Static Credentials</button>
          {status && <p>{status}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
