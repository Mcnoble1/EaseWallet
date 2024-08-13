import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = 'https://madad.onrender.com/api/admin/feedback';

export const getFeedbacks = async (token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${baseUrl}/get`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};

export const getFeedback = async (feedbackId: number, token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${baseUrl}/get/${feedbackId}`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

export const searchFeedbacks = async (search: string, token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const data = new URLSearchParams();
    data.append('search', search);

    const response = await axios.post(`${baseUrl}/search/${search}`, data, config);
    return response.data.data;
  } catch (error) {
    console.error(`Error searching for '${search}':`, error);
    toast.error(`${search} does not exist`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });   
    throw error;
  }
};

export const deleteFeedback = async (feedbackId: string, token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${baseUrl}/delete/${feedbackId}`, config);
    toast.success('Feedback deleted successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};
