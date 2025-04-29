// src/hooks/useOrderForm.js

import { useState, useEffect } from 'react';
import { getEmployees } from '../api/employeesApi';
import { getCustomers } from '../api/customersApi';
import { getOrders, createOrder, updateOrder, deleteOrder, exportOrdersPdf, getOrderDetails } from '../api/ordersApi';
import { getShippers } from '../api/shippersApi';
import { getProducts } from '../api/productsApi'; // IMPORTANTE
// 🔵 Agrega la función getProducts() en tu API si no la tienes.

export function useOrderForm() {
  const [formData, setFormData] = useState({
    orderId: '',
    customerId: '',
    employeeId: '',
    shipAddress: '',
    shipVia: '',
    orderDate: ''
  });

  const [mode, setMode] = useState('view'); // 'view' | 'new' | 'edit'
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lines, setLines] = useState([]);
  const [products, setProducts] = useState([]);

  // Para líneas
  const [lineMode, setLineMode] = useState('view'); // 'view' | 'adding' | 'editing'
  const [currentLine, setCurrentLine] = useState(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      const [employeesRes, customersRes, shippersRes, ordersRes, productsRes] = await Promise.all([
        getEmployees(),
        getCustomers(),
        getShippers(),
        getOrders(),
        getProducts()
      ]);
  
      setEmployees(employeesRes.data || employeesRes); // 👈 SIN map ni toString
      setCustomers(customersRes.data || customersRes);
      setShippers(shippersRes.data || shippersRes);
      setOrders(ordersRes.data || ordersRes);
      setProducts(productsRes.data || productsRes);
  
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveOrder = async () => {
    try {
      if (mode === "new") {
        await createOrder({
          customerId: formData.customerId,
          employeeId: formData.employeeId,
          shipAddress: formData.shipAddress,
          shipVia: formData.shipVia,
          orderDate: formData.orderDate,
          orderDetails: lines
        });
      } else if (mode === "edit") {
        await updateOrder({
          orderId: formData.orderId,
          customerId: formData.customerId,
          employeeId: formData.employeeId,
          shipAddress: formData.shipAddress,
          shipVia: formData.shipVia,
          orderDate: formData.orderDate,
          orderDetails: lines
        });
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };
  
  
  const searchOrder = async (orderId) => {
    try {
      const foundOrder = orders.find((order) => order.orderId.toString() === orderId);
      if (foundOrder) {
        setFormData({
          orderId: foundOrder.orderId,
          customerId: foundOrder.customerId,
          employeeId: foundOrder.employeeId || "",
          shipAddress: foundOrder.shipAddress || "",
          shipVia: foundOrder.shipperId || "",
          orderDate: foundOrder.orderDate ? foundOrder.orderDate.substring(0, 10) : "",
        });
        console.log("Found order details:", foundOrder.orderDetails);

        setLines(foundOrder.orderDetails || []); // ✅ aquí el cambio
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error searching order:", error);
      return false;
    }
  };
  

 /* const searchOrder = async (orderId) => {
    try {
      const foundOrder = orders.find((order) => order.orderId.toString() === orderId);
  
      console.log("Found Order:", foundOrder); // 👈 AGREGAR ESTO
      
      if (foundOrder) {
        setFormData({
          orderId: foundOrder.orderId,
          customerId: foundOrder.customerId,
          employeeId: foundOrder.employeeId ? foundOrder.employeeId.toString() : "",
          shipAddress: foundOrder.shipAddress || "",
          shipVia: foundOrder.shipperId ? foundOrder.shipperId.toString() : "",
          orderDate: foundOrder.orderDate ? foundOrder.orderDate.substring(0, 10) : "",
        });
        
        setLines(foundOrder.details || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error searching order:", error);
      return false;
    }
  };*/

  const handleLineNew = () => {
    setCurrentLine({ productId: '', quantity: 1, unitPrice: 0, total: 0 });
    setLineMode('adding');
    setSelectedLineIndex(null);
  };

  const handleLineEdit = (index) => {
    setCurrentLine({ ...lines[index] });
    setLineMode('editing');
    setSelectedLineIndex(index);
  };

  const handleLineSave = () => {
    if (lineMode === 'adding') {
      setLines([...lines, currentLine]);
    } else if (lineMode === 'editing') {
      const updatedLines = [...lines];
      updatedLines[selectedLineIndex] = currentLine;
      setLines(updatedLines);
    }
    setCurrentLine(null);
    setLineMode('view');
  };

  const handleLineCancel = () => {
    setCurrentLine(null);
    setLineMode('view');
  };

  const handleLineDelete = (index) => {
    if (confirm('Are you sure you want to delete this line?')) {
      const updatedLines = lines.filter((_, idx) => idx !== index);
      setLines(updatedLines);
    }
  };

  return {
    formData,
    setFormData,
    mode,
    setMode,
    employees,
    customers,
    shippers,
    orders,
    products,
    lines,
    setLines,
    lineMode,
    currentLine,
    handleLineNew,
    handleLineEdit,
    handleLineSave,
    handleLineCancel,
    handleLineDelete,
    setCurrentLine,
    setLines,
    searchOrder,
    saveOrder,
    deleteOrder,
  };


}
