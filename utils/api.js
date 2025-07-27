import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Base URL
const BASE_URL = 'http://192.168.226.115:8000/api';

// ✅ Auth token (optional if you use Token auth)
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { Authorization: `Token ${authToken}` }),
});

// ✅ Fetch items
export const getInventoryItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    alert('Error fetching items: ' + (error.response?.data?.detail || error.message));
    return [];
  }
};

// ✅ Fetch notifications (NEW!)
export const fetchNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem('access'); // assumes JWT token is stored
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${BASE_URL}/notifications/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Notification fetch error:', error.message);
    return [];
  }
};
