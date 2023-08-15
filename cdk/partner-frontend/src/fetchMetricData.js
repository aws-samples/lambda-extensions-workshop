import axios from 'axios';

const fetchMetricData = async () => {
  const apiGatewayURL = process.env.API_URL; // Replace with your API Gateway URL
  const endpoint = 'metric';

  try {
    const response = await axios.get(apiGatewayURL + endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export default fetchMetricData;