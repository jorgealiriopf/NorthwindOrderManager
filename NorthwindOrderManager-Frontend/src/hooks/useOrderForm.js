import { useState, useEffect } from 'react';
import { getEmployees } from '../api/employeesApi';
import { getCustomers } from '../api/customersApi';
import { getOrders, createOrder, updateOrder, deleteOrder, exportOrdersPdf } from '../api/ordersApi';
import { getShippers } from '../api/shippersApi';

export const useOrderForm = (onOrderCreated) => {
  const [formData, setFormData] = useState({
    orderId: '',
    customerId: '',
    employeeId: '',
    shipAddress: '',
    shipVia: '',
    orderDate: ''
  });

  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [mode, setMode] = useState('view'); // 'view', 'new', 'edit'

  useEffect(() => {
    fetchEmployees();
    fetchCustomers();
    fetchOrders();
    fetchShippers();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchShippers = async () => {
    try {
      const response = await getShippers();
      setShippers(response.data);
    } catch (error) {
      console.error('Error fetching shippers:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toISOString().substring(0, 10); // Formato yyyy-MM-dd
      handleChange({ target: { name: 'orderDate', value: formattedDate } });
    } else {
      handleChange({ target: { name: 'orderDate', value: '' } });
    }
  };
  
  const handleNew = () => {
    setFormData({
      orderId: '',
      customerId: '',
      employeeId: '',
      shipAddress: '',
      shipVia: '',
      orderDate: ''
    });
    setMode('new');
  };

  const handleSaveNew = async () => {
    try {
      await createOrder({
        customerId: formData.customerId,
        employeeId: parseInt(formData.employeeId),
        orderDate: formData.orderDate,
        shipAddress: formData.shipAddress,
        shipVia: parseInt(formData.shipVia) || 1
      });
      alert('Orden creada exitosamente');
      if (onOrderCreated) onOrderCreated();
      resetToView();
    } catch (error) {
      console.error('Error creando orden:', error);
      alert('Error al crear la orden');
    }
  };

  const handleSaveUpdate = async () => {
    try {
      console.log('Actualizando con datos:', {
        orderId: parseInt(formData.orderId),
        customerId: formData.customerId,
        employeeId: parseInt(formData.employeeId),
        orderDate: formData.orderDate,
        shipAddress: formData.shipAddress,
        shipVia: parseInt(formData.shipVia)
      });
  
      await updateOrder(formData.orderId, {
        orderId: parseInt(formData.orderId),
        customerId: formData.customerId,
        employeeId: parseInt(formData.employeeId),
        orderDate: formData.orderDate,
        shipAddress: formData.shipAddress,
        shipVia: parseInt(formData.shipVia)
      });
      alert('Orden actualizada exitosamente');
      if (onOrderCreated) onOrderCreated();
      resetToView();
    } catch (error) {
      console.error('Error actualizando orden:', error);
      alert('Error al actualizar la orden');
    }
  };

  

  const handleDelete = async () => {
    if (!formData.orderId) {
      alert('No hay orden seleccionada para eliminar');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar esta orden?')) {
      try {
        await deleteOrder(formData.orderId);
        alert('Orden eliminada exitosamente');
        if (onOrderCreated) onOrderCreated();
        resetToView();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error al eliminar la orden');
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      fillFormWithOrder(orders[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < orders.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      fillFormWithOrder(orders[newIndex]);
    }
  };

  const handleSearch = () => {
    const searchId = prompt('Ingrese el Order ID a buscar:');
    if (searchId) {
      const foundIndex = orders.findIndex(order => order.orderId.toString() === searchId);
      if (foundIndex !== -1) {
        setCurrentIndex(foundIndex);
        fillFormWithOrder(orders[foundIndex]);
      } else {
        alert('Orden no encontrada');
      }
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await exportOrdersPdf();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'OrdersReport.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generando el PDF');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateMode = () => {
    setMode('edit');
  };

  const handleCancel = () => {
    if (currentIndex >= 0) {
      fillFormWithOrder(orders[currentIndex]);
    } else {
      resetToView();
    }
  };

  const resetToView = () => {
    setFormData({
      orderId: '',
      customerId: '',
      employeeId: '',
      shipAddress: '',
      shipVia: '',
      orderDate: ''
    });
    setMode('view');
  };

  const fillFormWithOrder = (order) => {
    setFormData({
      orderId: order.orderId,
      customerId: order.customerId,
      employeeId: order.employeeId.toString(),
      shipAddress: order.shipAddress,
      shipVia: order.shipVia?.toString() || '',
      orderDate: order.orderDate ? order.orderDate.substring(0, 10) : ''
    });
    setMode('view');
  };

  return {
    formData,
    employees,
    customers,
    shippers,
    mode,
    handleNew,
    handleSaveNew,
    handleSaveUpdate,
    handleUpdateMode,
    handleDelete,
    handlePrevious,
    handleNext,
    handleSearch,
    handleGeneratePDF,
    handleChange,
    handleCancel,
    handleDateChange
  };
};
