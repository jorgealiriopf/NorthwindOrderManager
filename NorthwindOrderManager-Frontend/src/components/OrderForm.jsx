//import React from "react";
import { useOrderForm } from "../hooks/useOrderForm";
import OrderLines from "./OrderLines";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";



const OrderForm = () => {
  const {
    formData,
    setFormData,
    customers,
    employees,
    shippers,
    products,
    lines,
    lineMode,
    currentLine,
    orders,
    handleLineNew,
    handleLineEdit,
    handleLineSave,
    handleLineCancel,
    handleLineDelete,
    setLines,
    deleteOrder,
    setCurrentLine,
    searchOrder,
    setMode,
    saveOrder,
    mode,
  } = useOrderForm();

  const [formMode, setFormMode] = useState('view');
  const isFormEnabled = mode !== "view";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, orderDate: date.toISOString().substring(0, 10) }));
  };

  const onNew = () => {
    setFormData({
      orderId: '',
      customerId: '',
      employeeId: '',
      shipAddress: '',
      shipVia: '',
      orderDate: '',
    });
    setLines([]); // Opcional, limpia también las líneas
    setMode('new'); // Cambia el modo a 'new'
  };

  const onSearch = async () => {
    const orderId = prompt("Enter Order ID:");
    if (orderId) {
      const found = await searchOrder(orderId);
      if (found) {
        setFormMode('view');
      } else {
        alert("Order not found!");
      }
    }
  };

  const onCancel = () => {
    setFormData({
      orderId: '',
      customerId: '',
      employeeId: '',
      shipAddress: '',
      shipVia: '',
      orderDate: '',
    });
    setLines([]);
    setMode('view');
  };

  const onPrevious = () => {
    const index = orders.findIndex(order => order.orderId === formData.orderId);
    if (index > 0) {
      const previousOrder = orders[index - 1];
      loadOrderIntoForm(previousOrder);
    }
  };

  const onNext = () => {
    const index = orders.findIndex(order => order.orderId === formData.orderId);
    if (index < orders.length - 1) {
      const nextOrder = orders[index + 1];
      loadOrderIntoForm(nextOrder);
    }
  };

  const loadOrderIntoForm = (order) => {
    setFormData({
      orderId: order.orderId,
      customerId: order.customerId,
      employeeId: order.employeeId,
      shipAddress: order.shipAddress,
      shipVia: order.shipVia,
      orderDate: order.orderDate,
    });
    setLines(order.orderDetails || []); // Si quieres, puedes cargar detalles también
    setMode('view');
  };


  const onSave = async () => {
    try {
      await saveOrder(); // 👈 Aquí ya no dará error
      setMode('view');
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };


  const onUpdate = () => {
    setMode('edit');
  };

  const onDelete = async () => {
    if (!formData.orderId) {
      console.error("No order selected to delete.");
      return;
    }

    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(formData.orderId);
        setFormData({
          orderId: '',
          customerId: '',
          employeeId: '',
          shipAddress: '',
          shipVia: '',
          orderDate: '',
        });
        setLines([]);
        setMode('view');
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const isNew = mode === "new";
  //console.log("FormData at render:", formData);

  return (
    <div className="container mt-4">

      {/* Botones principales 
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button className="btn btn-primary me-2" onClick={handleNew}>New</button>
          <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
          <button className="btn btn-warning me-2" onClick={handleEdit}>Update</button>
          <button className="btn btn-danger me-2" onClick={handleDelete}>Delete</button>
          <button className="btn btn-secondary me-2" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-info me-2">Generate</button>
          <button className="btn btn-light me-2">{'<'}</button>
          <button className="btn btn-light me-2">{'>'}</button>
          <button className="btn btn-dark" onClick={handleSearch}>🔍</button>
        </div>
        <div>
          <strong>ORDER ID: {formData.orderId || '-'}</strong>
        </div>
      </div>
      */}

      <div className="d-flex justify-content-between align-items-center mb-3">

        {/* Botones de Acciones */}
        <div>
          {mode === 'view' && (
            <>
              <button className="btn btn-primary me-2" onClick={onNew}>New</button>
              {formData.orderId && (
                <>
                  <button className="btn btn-warning me-2" onClick={onUpdate}>Update</button>
                  <button className="btn btn-danger me-2" onClick={onDelete}>Delete</button>
                </>
              )}
            </>
          )}

          {(mode === 'new' || mode === 'edit') && (
            <>
              <button className="btn btn-success me-2" onClick={onSave}>Save</button>
              <button className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
            </>
          )}
        </div>

        {/* Botones de Navegación */}
        <div>
          {mode === 'view' && (
            <>
              <button className="btn btn-success">Generate</button>
              &nbsp;
              &nbsp;
              <button className="btn btn-outline-dark" onClick={onPrevious}>{'<'}</button>
              &nbsp;
              <button className="btn btn-outline-dark" onClick={onNext}>{'>'}</button>
              &nbsp;
              &nbsp;
              <button className="btn btn-outline-secondary" onClick={onSearch} >🔍</button>
            </>
          )}
        </div>

      </div>
      &nbsp;
      {/* Order ID visual */}
      <div className="d-flex justify-content-left my-3">
      
        <h3>Order ID: {formData.orderId || '-'}</h3>
      </div>
      &nbsp;
      {/* Formulario de datos */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Customer</label>
          <select
            name="customerId"
            className="form-select"
            value={formData.customerId}
            onChange={handleInputChange}
            disabled={!isFormEnabled}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Shipping Address</label>
          <div className="input-group">
            <input
              type="text"
              name="shipAddress"
              className="form-control"
              value={formData.shipAddress || ""}
              onChange={handleInputChange}
              disabled={!isFormEnabled}
            />
            <button className="btn btn-outline-primary" type="button">Validate</button>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Order Date</label>
          <div>
            <DatePicker
              selected={formData.orderDate ? new Date(formData.orderDate) : new Date()}
              onChange={handleDateChange}
              disabled={!isFormEnabled}
              className="form-control"
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Employee</label>
          <select
            name="employeeId"
            className="form-select"
            value={formData.employeeId ? Number(formData.employeeId) : ""}
            onChange={handleInputChange}
            disabled={!isFormEnabled}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.fullName}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Sección de Lines */}
      <div className="mt-5">
        <OrderLines
          products={products}
          lines={lines}
          lineMode={lineMode}
          currentLine={currentLine}
          handleLineNew={handleLineNew}
          handleLineEdit={handleLineEdit}
          handleLineSave={handleLineSave}
          handleLineCancel={handleLineCancel}
          handleLineDelete={handleLineDelete}
          setCurrentLine={setCurrentLine}
        />
      </div>

    </div>
  );
};

export default OrderForm;
