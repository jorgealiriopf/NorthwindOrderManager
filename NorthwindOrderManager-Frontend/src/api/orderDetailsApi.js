import axios from "axios";

export const getOrderLinesByOrderId = async (orderId) => {
  const response = await axios.get(`http://localhost:5027/api/orders/${orderId}/details`);

  return response.data;
};

export const addOrderLine = async (orderId, detail) => {
  return axios.post(`http://localhost:5027/api/orders/${orderId}/details`, detail);
};

