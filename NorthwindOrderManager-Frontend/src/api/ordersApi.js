import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/orders';

export const getOrders = () => axios.get(BASE_URL);
export const createOrder = (orderData) => axios.post(BASE_URL, orderData);
export const updateOrder = (orderId, orderData) => axios.put(`${BASE_URL}/${orderId}`, orderData);
export const deleteOrder = (orderId) => axios.delete(`${BASE_URL}/${orderId}`);
export const exportOrdersPdf = () => axios.get(`${BASE_URL}/export`, { responseType: 'blob' });
