import axios from 'axios';

const baseURL = "http://localhost:3000/api";

export const getRoutes = async () => {
  try {
    const response = await axios.get(`${baseURL}/incidentes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export const getIncidents = async () => {
  try {
    const response = await axios.get(`${baseURL}/incidentes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};
