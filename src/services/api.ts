import axios from 'axios';

const API_BASE_URL = "https://afrodoctor-call-service.onrender.com";

export const getCallToken = async (callId: number) => {
  const response = await axios.post(`${API_BASE_URL}/calls/${callId}/join`);
  return response.data; 
};

export const endCallApi = async (callId: number) => {
  await axios.post(`${API_BASE_URL}/calls/${callId}/end`);
};