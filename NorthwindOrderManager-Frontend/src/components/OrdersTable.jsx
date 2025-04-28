import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
          const response = await axios.get('http://localhost:5027/api/orders');
          console.log('Órdenes recibidas:', response.data); // 👈 Agrega esta línea
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

    const handleExportPdf = async () => {
        try {
            const response = await axios.get('http://localhost:5027/api/orders/export', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'OrdersReport.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };

    return (
        <div>
            <h2>Listado de Órdenes</h2>

            <button className="btn btn-success mb-3" onClick={handleExportPdf}>
                Exportar Órdenes a PDF
            </button>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Ship Address</th>
                        <th>Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{order.customer?.companyName || 'N/A'}</td>
                            <td>{order.shipAddress || 'N/A'}</td>
                            <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;
