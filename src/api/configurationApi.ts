import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://madad.onrender.com/api/admin/configuration';

export const fetchCategories = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || 'Error fetching categories', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
    throw error
  }
};

// get category by id
export const fetchCategory = async (token: string, categoryId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching category');
  }
};

export const createCategory = async (token: string, formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-category`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating category');
  }
};

// update category by id
export const updateCategory = async (token: string, categoryId: string, formData: FormData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-category/${categoryId}`, formData
        , {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data;
    } catch (error) {
    throw new Error(error.response.data.message || 'Error updating category');
    }
};

// delete category by id
export const deleteCategory = async (token: string, categoryId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting category');
  }
};

// search category
export const searchCategory = async (search: string, token: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
  
      const data = new URLSearchParams();
      data.append('search', search);
  
      const response = await axios.post(`${API_BASE_URL}/search-category`, data, config);
      return response.data.result;
    } catch (error) {
      console.error(`Error searching for '${search}':`, error);
      throw error;
    }
  };


// Services
export const createService = async (token: string, data: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-service`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating service');
  }
};


// areas
export const fetchAreas = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-areas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching areas');
  }
}

// get area by id
export const fetchArea = async (token: string, areaId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-area/${areaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching area');
  }
}

// create area
export const createArea = async (token: string, data: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-area`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(response)
    if (response.status === 200) {
      toast.success('Area created successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    return response.data;
    
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating area');
  }
}

// update area by id
export const updateArea = async (token: string, areaId: string, data: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-area/${areaId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating area');
  }
}

// delete area 
export const deleteArea = async (token: string, areaId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-area/${areaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting area');
  }
}

// landmarks
export const fetchLandmarks = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-landmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching landmarks');
  }
}

// get landmark by id
export const fetchLandmark = async (token: string, landmarkId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-landmark/${landmarkId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching landmark');
  }
}

// create landmark
export const createLandmark = async (token: string, data: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-landmark`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating landmark');
  }
}

// update landmark by id
export const updateLandmark = async (token: string, landmarkId: string, data: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-landmark/${landmarkId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating landmark');
  }
}

// delete landmark
export const deleteLandmark = async (token: string, landmarkId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-landmark/${landmarkId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting landmark');
  }
}

// Blocks
export const fetchBlocks = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-blocks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching blocks');
  }
}

// get block by id
export const fetchBlock = async (token: string, blockId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-block/${blockId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching block');
  }
}

// create block
export const createBlock = async (token: string, data: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-block`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating block');
  }
}

// update block by id
export const updateBlock = async (token: string, blockId: string, data: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-block/${blockId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating block');
  }
}

// delete block
export const deleteBlock = async (token: string, blockId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-block/${blockId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting block');
  }
}

//  Vehicles
export const fetchVehicles = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching vehicles');
  }
}

// get vehicle by id
export const fetchVehicle = async (token: string, vehicleId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-vehicle/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching vehicle');
  }
}

// create vehicle 
export const createVehicle = async (token: string, data: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-vehicle`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error creating vehicle');
  }
}

// update vehicle by id
export const updateVehicle = async (token: string, vehicleId: string, data: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-vehicle/${vehicleId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating vehicle');
  }
}

// delete vehicle
export const deleteVehicle = async (token: string, vehicleId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-vehicle/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error deleting vehicle');
  }
}


