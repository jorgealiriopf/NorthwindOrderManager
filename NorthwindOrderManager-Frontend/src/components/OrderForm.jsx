import { useOrderForm } from "../hooks/useOrderForm";
import OrderLines from "./OrderLines";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { getOrderLinesByOrderId } from "../api/orderDetailsApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { fetchOrderPdf } from '../api/ordersApi';
import logo from '../assets/rsm_logo.png';
import { createOrder, updateOrder } from '../api/ordersApi';


const OrderForm = ({ onReload }) => {
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

  const handleExportPdf = async () => {
    const form = document.getElementById("order-form-pdf");
    if (!form) return;

    try {
      const canvas = await html2canvas(form);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`Order_${formData.orderId || "New"}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF.");
    }
  };

  const handleDownloadServerPdf = async () => {
    try {
      const blob = await fetchOrderPdf(formData.orderId);
      // Crea una URL temporal para el blob
      const url = URL.createObjectURL(blob);
      // Crea un enlace invisible y dispara la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `order_${formData.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Libera la URL
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('No se pudo descargar el PDF desde el servidor.');
    }
  };


  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, orderDate: date.toISOString().substring(0, 10) }));
  };

  const [validatedAddress, setValidatedAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    coordinates: ''
  });

  const validateAddress = async () => {
    // 1) Toma la dirección directamente de tu estado formData
    const address = formData.shipAddress;
    if (!address) {
      alert("Por favor ingresa una dirección primero.");
      return;
    }

    try {
      // 2) Llama al endpoint que creaste en tu API
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/geocode?address=${encodeURIComponent(address)}`
      );
      const data = await res.json();

      if (data.status !== "OK") {
        alert("No se pudo validar la dirección.");
        return;
      }

      // 3) Procesa la respuesta
      const result = data.results[0];
      const components = result.address_components;
      const getComponent = (types) =>
        components.find(c => types.every(t => c.types.includes(t)))?.long_name || "";

      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;

      // 4) Guarda los datos desglosados
      setValidatedAddress({
        street: getComponent(["route"]),
        city: getComponent(["locality"]),
        state: getComponent(["administrative_area_level_1"]),
        postalCode: getComponent(["postal_code"]),
        country: getComponent(["country"]),
        coordinates: `${lat}, ${lng}`
      });

      // 5) Muestra el mapa
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_API_KEY // si lo usas aquí
      });
      const { AdvancedMarkerElement } = window.google.maps.marker;
      new AdvancedMarkerElement({ map, position: { lat, lng } });
    } catch (err) {
      console.error("Error validating address:", err);
      alert("Error validando la dirección.");
    }
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

  const onPrevious = async () => {
    if (!orders.length) return;

    const currentIndex = orders.findIndex(o => o.orderId === formData.orderId);
    const prevIndex = currentIndex <= 0 ? orders.length - 1 : currentIndex - 1;
    const prevOrder = orders[prevIndex];

    setFormData({
      orderId: prevOrder.orderId,
      customerId: prevOrder.customerId,
      employeeId: prevOrder.employeeId || "",
      shipAddress: prevOrder.shipAddress || "",
      shipVia: prevOrder.shipper?.shipperId || "",
      orderDate: prevOrder.orderDate?.substring(0, 10) || ""
    });

    try {
      const details = await getOrderLinesByOrderId(prevOrder.orderId);
      setLines(details);
    } catch (err) {
      console.error("Error loading order details for previous order:", err);
      setLines([]);
    }
  };

  const onNext = async () => {
    if (!orders.length) return;

    const currentIndex = orders.findIndex(o => o.orderId === formData.orderId);
    const nextIndex = currentIndex === -1 || currentIndex >= orders.length - 1 ? 0 : currentIndex + 1;
    const nextOrder = orders[nextIndex];

    setFormData({
      orderId: nextOrder.orderId,
      customerId: nextOrder.customerId,
      employeeId: nextOrder.employeeId || "",
      shipAddress: nextOrder.shipAddress || "",
      shipVia: nextOrder.shipper?.shipperId || "",
      orderDate: nextOrder.orderDate?.substring(0, 10) || ""
    });

    try {
      const details = await getOrderLinesByOrderId(nextOrder.orderId);
      setLines(details);
    } catch (err) {
      console.error("Error loading order details for next order:", err);
      setLines([]);
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
      if (mode === 'new') {
        const response = await createOrder({
          customerId: formData.customerId,
          employeeId: formData.employeeId,
          shipAddress: formData.shipAddress,
          shipVia: formData.shipVia,
          orderDate: formData.orderDate,
          orderDetails: lines
        });
  
        const createdOrder = response.data;
  
        alert(`Order ${createdOrder.orderId} created successfully!`);
  
        // ✅ Mantener datos ingresados y actualizar solo el ID
        setFormData(prev => ({
          ...prev,
          orderId: createdOrder.orderId
        }));
  
        // ✅ Quedarse en modo "view"
        setMode('view');
  
      } else if (mode === 'edit') {
        await updateOrder({ ...formData, orderDetails: lines });

      alert(`Order ${formData.orderId} updated successfully!`);
      setMode('view');
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error saving the order.");
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
        onReload();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const isNew = mode === "new";
  //console.log("FormData at render:", formData);

  return (

    <div className="container mt-4">
      <div className="d-flex justify-content-center align-items-center">
        <img
          src={logo}
          alt="RSM Logo"
          style={{ height: '100px', marginRight: '0.75rem' }}
        />
        <h1 className="m-0">Final project</h1>
      </div>
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
              <button className="btn btn-success" onClick={handleDownloadServerPdf}>Generate</button>
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
            <button className="btn btn-outline-primary" type="button" onClick={validateAddress}>Validate</button>
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

      {/* Sección de Validated address*/}
      <div className="mt-4">
        <h4>Validated Address</h4>
        <div className="row mb-2">
          <div className="col-md-4">
            <label className="form-label">Street</label>
            <input type="text" className="form-control" value={validatedAddress.street} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label">City</label>
            <input type="text" className="form-control" value={validatedAddress.city} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label">State</label>
            <input type="text" className="form-control" value={validatedAddress.state} readOnly />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-4">
            <label className="form-label">Postal Code</label>
            <input type="text" className="form-control" value={validatedAddress.postalCode} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label">Country</label>
            <input type="text" className="form-control" value={validatedAddress.country} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label">Coordinates</label>
            <input type="text" className="form-control" value={validatedAddress.coordinates} readOnly />
          </div>
        </div>

        <div className="mb-3" style={{ height: '300px' }}>
          <div id="map" style={{ height: "300px", width: "100%", marginTop: "20px" }}></div>
        </div>
      </div>


    </div>
  );
};

export default OrderForm;
