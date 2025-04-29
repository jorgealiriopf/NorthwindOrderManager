import React from 'react';

const OrderLines = ({
  products,
  lines,
  lineMode,
  currentLine,
  handleLineNew,
  handleLineEdit,
  handleLineSave,
  handleLineCancel,
  handleLineDelete,
  setCurrentLine
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLine((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
      total: name === "quantity" ? prev.unitPrice * parseInt(value) : prev.total,
    }));
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(p => p.productId === parseInt(e.target.value));
    if (selectedProduct) {
      setCurrentLine({
        ...currentLine,
        productId: selectedProduct.productId,
        unitPrice: selectedProduct.unitPrice,
        total: selectedProduct.unitPrice * currentLine.quantity
      });
    }
  };

  return (
    <div className="mt-4">

      {/* Encabezado Lines + Botones */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Lines</h4>
        {lineMode === "view" ? (
          <div>
            <button className="btn btn-primary me-2" onClick={handleLineNew}>New</button>
          </div>
        ) : (
          <div>
            <button className="btn btn-success me-2" onClick={handleLineSave}>Save</button>
            <button className="btn btn-secondary" onClick={handleLineCancel}>Cancel</button>
          </div>
        )}
      </div>

      {/* Tabla de líneas */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              {lineMode === "view" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={index}>
                <td>
                  {lineMode === "editing" && currentLine?.productId === line.productId ? (
                    <select
                      value={currentLine.productId}
                      onChange={handleProductChange}
                      className="form-select"
                    >
                      {products.map((product) => (
                        <option key={product.productId} value={product.productId}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    products.find(p => p.productId === line.productId)?.productName || ""
                  )}
                </td>
                <td>
                  {lineMode === "editing" && currentLine?.productId === line.productId ? (
                    <input
                      type="number"
                      name="quantity"
                      value={currentLine.quantity}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    line.quantity
                  )}
                </td>
                <td>${line.unitPrice.toFixed(2)}</td>
                <td>${line.total.toFixed(2)}</td>
                {lineMode === "view" && (
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleLineEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleLineDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {lineMode === "adding" && (
              <tr>
                <td>
                  <select
                    value={currentLine?.productId || ""}
                    onChange={handleProductChange}
                    className="form-select"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={currentLine?.quantity || 1}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </td>
                <td>${currentLine?.unitPrice?.toFixed(2) || "0.00"}</td>
                <td>${currentLine?.total?.toFixed(2) || "0.00"}</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderLines;
