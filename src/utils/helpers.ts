import { toast } from 'react-toastify';
import axios from 'axios';

export const showSuccessNotification = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
  });
};

export const showErrorNotification = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
  });
};

export const closePopup = (stateSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
  stateSetter(false);
};

export const validateToken = async (token: string) => {
  try {
    const response = await axios.get('https://madad.onrender.com/api/admin/login', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error validating token');
  }
};

export const validateRequiredFields = (fields: string[], data: Record<string, any>) => {
  return fields.filter((field) => !data[field]);
};

export const letterRegex = /^[A-Za-z\s]+$/;

 export const formatDatetime = (datetimeString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(datetimeString).toLocaleDateString(undefined, options);
    return formattedDate;
  };