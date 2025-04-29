import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/orders';

export const getOrders = () =>
  axios.get(BASE_URL).then(response => response.data);

export const createOrder = (order) =>
  axios.post(BASE_URL, order);

export const updateOrder = (orderId, order) =>
  axios.put(`${BASE_URL}/${orderId}`, order);

export const deleteOrder = (orderId) =>
  axios.delete(`${BASE_URL}/${orderId}`);

export const exportOrdersPdf = () =>
  axios.get(`${BASE_URL}/export`, { responseType: 'blob' });

export const getOrderDetails = (orderId) => 
  axios.get(`${BASE_URL}/${orderId}/details`).then(response => response.data);
