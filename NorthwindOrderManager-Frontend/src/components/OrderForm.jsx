import React from 'react';
import { useOrderForm } from '../hooks/useOrderForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const OrderForm = ({ onOrderCreated }) => {
  const {
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
    handleCancel
  } = useOrderForm(onOrderCreated);

  const isReadOnly = mode === 'view';

  return (
    <div className="container-fluid mt-4 px-5">
      {/* Barra de botones */}
      <div className="row mb-3">
        <div className="col d-flex gap-2 flex-wrap">
          {mode === 'view' && (
            <>
              <button type="button" className="btn btn-primary" onClick={handleNew}>New</button>
              {formData.orderId && (
                <>
                  <button type="button" className="btn btn-warning" onClick={handleUpdateMode}>Update</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </>
              )}
            </>
          )}
          {mode === 'new' && (
            <>
              <button type="button" className="btn btn-success" onClick={handleSaveNew}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </>
          )}
          {mode === 'edit' && (
            <>
              <button type="button" className="btn btn-success" onClick={handleSaveUpdate}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
        <div className="col d-flex justify-content-end gap-2 flex-wrap">
          <button type="button" className="btn btn-success" onClick={handleGeneratePDF}>Generate</button>
          <button type="button" className="btn btn-secondary" onClick={handlePrevious}>&lt;</button>
          <button type="button" className="btn btn-secondary" onClick={handleNext}>&gt;</button>
          <button type="button" className="btn btn-info" onClick={handleSearch}>🔍</button>
        </div>
      </div>

      {/* Label del Order ID */}
      <div className="row mb-3">
        <div className="col text-center">
          <h3><strong>Order ID: {formData.orderId || '-'}</strong></h3>
        </div>
      </div>

      {/* Formulario */}
      <form>
        <div className="row">
          {/* Columna izquierda */}
          <div className="col-lg-6 col-md-12">
            <div className="mb-3">
              <label className="form-label">Customer</label>
              <select
                name="customerId"
                className="form-select"
                value={formData.customerId}
                onChange={handleChange}
                disabled={isReadOnly}
                required
              >
                <option value="">Seleccione un cliente</option>
                {customers.map(cust => (
                  <option key={cust.customerId} value={cust.customerId}>
                    {cust.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
  <label className="form-label">Order Date</label>
  <DatePicker
    selected={formData.orderDate ? new Date(formData.orderDate) : null}
    onChange={(date) => handleDateChange(date)}
    className="form-control"
    dateFormat="yyyy-MM-dd"
    disabled={isReadOnly}
    placeholderText="Seleccione una fecha"
  />
</div>


          </div>

          {/* Columna derecha */}
          <div className="col-lg-6 col-md-12">
            <div className="mb-3">
              <label className="form-label">Shipping Address</label>
              <div className="input-group">
                <input
                  type="text"
                  name="shipAddress"
                  className="form-control"
                  value={formData.shipAddress}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  required
                />
                <button type="button" className="btn btn-outline-secondary" disabled>
                  Validate
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Employee</label>
              <select
                name="employeeId"
                className="form-select"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={isReadOnly}
                required
              >
                <option value="">Seleccione un empleado</option>
                {employees.map(emp => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ship Via</label>
              <select
                name="shipVia"
                className="form-select"
                value={formData.shipVia}
                onChange={handleChange}
                disabled={isReadOnly}
                required
              >
                <option value="">Seleccione un método de envío</option>
                {shippers.map(ship => (
                  <option key={ship.shipperId} value={ship.shipperId}>
                    {ship.companyName}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
