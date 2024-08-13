import axios from 'axios';

const baseUrl = 'https://madad.onrender.com/api/admin/transportation';

export const getTransportations = async (token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${baseUrl}/get`, config);
    return response.data.transportation;
  } catch (error) {
    console.error('Error fetching transportations:', error);
    throw error;
  }
};

export const getTransportation = async (transportationId: string, token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${baseUrl}/get/${transportationId}`, config);
    return response.data.transportation;
  } catch (error) {
    console.error('Error fetching transportation:', error);
    throw error;
  }
};

// create transportation
export const createTransportation = async (token: string, formData: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// update transportation by id
export const updateTransportation = async (token: string, transportationId: string, formData: FormData) => {
  try {
    const response = await axios.put(`${baseUrl}/update/${transportationId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchTransportations = async (search: string, token: string) => {
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
    return response.data.result;
  } catch (error) {
    console.error(`Error searching for '${search}':`, error);
    throw error;
  }
};

export const deleteTransportation = async (transportationId: string, token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${baseUrl}/delete/${transportationId}`, config);
  } catch (error) {
    console.error('Error deleting transportation:', error);
    throw error;
  }
};
