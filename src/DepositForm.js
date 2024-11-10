import React, { useState } from 'react';
import axios from 'axios';

const DepositForm = ({ authToken }) => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleDeposit = async (event) => {
    event.preventDefault();
    try {
      // Make the API request using axios
      const response = await axios.post(
        'https://localhost:5000/api/Transaction/deposit',
        { amount: parseFloat(amount) },  // Body of the request
        {
          headers: {
            'Content-Type': 'application/json',  // Set the content type to JSON
            Authorization: `Bearer ${authToken}`,  // Include the token for authentication
          }
        }
      );

      // Check if the response was successful and update the UI accordingly
      if (response.status === 200) {
        setStatus('Deposit successful!');
      } else {
        setStatus(`Deposit failed: ${response.data.message}`);
      }
    } catch (error) {
      // Handle error if something goes wrong
      if (error.response) {
        // The server responded with a status outside 2xx range
        setStatus(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        setStatus('Error: No response from server.');
      } else {
        // Something else went wrong during the request
        setStatus('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h3>Deposit Form</h3>
      <form onSubmit={handleDeposit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to deposit"
          required
        />
        <button type="submit">Deposit</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default DepositForm;
