import axios from "axios";

export const getOrderLinesByOrderId = async (orderId) => {
  const response = await axios.get(`http://localhost:5027/api/orders/${orderId}/details`);

  return response.data;
};

export const addOrderLine = async (orderId, detail) => {
  return axios.post(`http://localhost:5027/api/orders/${orderId}/details`, detail);
};

export const updateOrderLine = async (orderId, detail) => {
  return axios.put(`http://localhost:5027/api/orders/${orderId}/details/${detail.productId}`, detail);
};

export const deleteOrderLine = async (orderId, productId) => {
  return axios.delete(`http://localhost:5027/api/orders/${orderId}/details/${productId}`);
};
