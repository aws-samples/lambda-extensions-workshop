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
    return null;
  }
};

export default fetchLogData;