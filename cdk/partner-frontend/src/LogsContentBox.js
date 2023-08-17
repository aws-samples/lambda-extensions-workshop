import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const fetchLogData = async () => {
  const apiGatewayURL = process.env.API_URL;
  const endpoint = 'log';

  try {
    const response = await axios.get(apiGatewayURL + endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching log data:', error);
    return [];
  }
};

export function LogsContentBox() {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLogData();
      // use only 10 most recent logs data
      setLogData(data.slice(0, 10));
    };

    // Call the function
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  console.log(logData);

  return (
    <div className="LogsContentBox">
      <h4>Function Logs</h4>
      <table>
        <thead>
          <tr>
            <th>Function Name</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logData.map((item, index) => (
            <tr key={index}>
              <td className="table-data">{item.functionName}</td>
              <td className="table-data">{item.message}</td>
              <td className="table-data">{item.timeStamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
