import axios from 'axios';

const fetchMetricData = async () => {
  const apiGatewayURL = process.env.REACT_APP_API_URL; 

  const endpoint = 'metric';

  const full_url = apiGatewayURL.concat(endpoint);
  
  try {
    const response = await axios.get(full_url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export default fetchMetricData;