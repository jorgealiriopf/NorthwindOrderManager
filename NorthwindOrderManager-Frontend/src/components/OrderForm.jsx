import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = ({ onOrderCreated }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    employeeId: '',
    shipAddress: '',
    shipVia: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5027/api/orders', {
        customerId: formData.customerId,
        employeeId: parseInt(formData.employeeId),
        orderDate: new Date().toISOString(),
        shipAddress: formData.shipAddress,
        shipVia: parseInt(formData.shipVia)
      });

      console.log('Order created:', response.data);
      if (onOrderCreated) {
        onOrderCreated();
      }
      setFormData({
        customerId: '',
        employeeId: '',
        shipAddress: '',
        shipVia: ''
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h2>Crear Nueva Orden</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Customer ID</label>
          <input type="text" name="customerId" className="form-control" value={formData.customerId} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input type="number" name="employeeId" className="form-control" value={formData.employeeId} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Ship Address</label>
          <input type="text" name="shipAddress" className="form-control" value={formData.shipAddress} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Ship Via (Shipper ID)</label>
          <input type="number" name="shipVia" className="form-control" value={formData.shipVia} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Crear Orden</button>
      </form>
    </div>
  );
};

export default OrderForm;
