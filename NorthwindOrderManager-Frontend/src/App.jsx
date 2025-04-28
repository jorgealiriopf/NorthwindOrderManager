import React from 'react';
import OrderForm from './components/OrderForm';
import OrdersTable from './components/OrdersTable'; // Si la tienes
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const handleReloadOrders = () => {
    window.location.reload(); // Refresca toda la app
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-4">Northwind Order Manager</h1>
      <OrderForm onOrderCreated={handleReloadOrders} />
      <hr />
      <OrdersTable />
    </div>
  );
}

export default App;

