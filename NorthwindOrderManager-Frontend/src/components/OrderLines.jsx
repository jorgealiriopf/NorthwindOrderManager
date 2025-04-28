import React from 'react';

const OrderLines = ({ orderLines, isLinesEditing, handleLineNew, handleLineEdit, handleLineDelete }) => {
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Lines</h4>
        <div>
          <button type="button" className="btn btn-primary me-2" onClick={handleLineNew}>New</button>
          {isLinesEditing && (
            <>
              <button type="button" className="btn btn-success me-2" onClick={handleLineEdit}>Save</button>
              <button type="button" className="btn btn-danger" onClick={handleLineDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {(orderLines || []).length > 0 ? (
            orderLines.map((line, index) => (
              <tr key={index}>
                <td>{line.productName}</td>
                <td>{line.quantity}</td>
                <td>${line.unitPrice.toFixed(2)}</td>
                <td>${(line.quantity * line.unitPrice).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No lines found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderLines;
