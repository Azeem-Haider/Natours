/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
//
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'Data' ? '/api/v1/users/updateMe' : '/api/v1/users/updateMyPassword';
    const res = await axios({
      method: 'patch',
      url,
      data,
    });
    if (res.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} Updated Successfuly`);
    location.reload(true);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
