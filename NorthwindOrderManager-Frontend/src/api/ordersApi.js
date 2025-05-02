import axios from "axios";

export const createOrder = async (order) => {
    return axios.post("http://localhost:5027/api/orders", {
        customerId: order.customerId || null,
        employeeId: order.employeeId || null,
        shipAddress: order.shipAddress || null,
        shipVia: order.shipVia ? Number(order.shipVia) : null,
        orderDate: order.orderDate || null,
        orderDetails: order.orderDetails || []
    });
};

export const updateOrder = async (order) => {
    return axios.put(`http://localhost:5027/api/orders/${order.orderId}`, {
      orderId: order.orderId, // 🔵 MUY IMPORTANTE
      customerId: order.customerId || null,
      employeeId: order.employeeId || null,
      shipAddress: order.shipAddress || null,
      shipVia: order.shipVia ? Number(order.shipVia) : null,
      orderDate: order.orderDate || null,
      orderDetails: order.orderDetails || [] // Aunque no lo actualices, mejor mantener estructura
    });
  };  
  
export const deleteOrder = async (orderId) => {
    return axios.delete(`http://localhost:5027/api/orders/${orderId}`);
};

export const getOrders = async () => {
    return axios.get("http://localhost:5027/api/orders");
};

export const exportOrdersPdf = async () => {
    return axios.get("http://localhost:5027/api/orders/export/pdf", {
        responseType: 'blob'
    });
};

export const getOrderDetails = async (orderId) => {
    return axios.get(`http://localhost:5027/api/orders/${orderId}/details`);
};

// ordersApi.js

/**
 * Descarga el PDF de la orden indicada desde el servidor
 * @param {number|string} orderId
 * @returns {Promise<Blob>}
 */
export async function fetchOrderPdf(orderId) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/pdf`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });
    if (!response.ok) {
      throw new Error(`Error al generar PDF: ${response.statusText}`);
    }
    return await response.blob();
  }
  

