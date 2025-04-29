import React from "react";
import { useOrderForm } from "../hooks/useOrderForm";
import OrderLines from "./OrderLines";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    handleLineNew,
    handleLineEdit,
    handleLineSave,
    handleLineCancel,
    handleLineDelete,
    setCurrentLine,
    handleSave,
    handleCancel,
    handleNew,
    handleEdit,
    handleDelete,
    handleSearch,
    mode,
  } = useOrderForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, orderDate: date.toISOString().substring(0, 10) }));
  };

  const isFormEnabled = mode !== "view";
  const isNew = mode === "new";

  return (
    <div className="container mt-4">

      {/* Botones principales */}
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
            value={formData.employeeId}
            onChange={handleInputChange}
            disabled={!isFormEnabled}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.firstName} {employee.lastName}
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
