import React, { useState } from 'react';
import axios from 'axios';

const WithdrawForm = ({ authToken }) => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleWithdraw = async (event) => {
    event.preventDefault();

    try {
      // Make the API request using axios
      const response = await axios.post(
        'https://localhost:5000/api/Transaction/withdraw',
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
        setStatus('Withdrawal successful!');
      } else {
        setStatus(`Withdrawal failed: ${response.data.message}`);
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
      <h3>Withdraw Form</h3>
      <form onSubmit={handleWithdraw}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to withdraw"
          required
        />
        <button type="submit">Withdraw</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default WithdrawForm;
