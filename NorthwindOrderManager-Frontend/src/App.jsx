import React from 'react';
import OrderForm from './components/OrderForm';
//import OrdersTable from './components/OrdersTable'; // Si la tienes
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const handleReloadOrders = () => {
    window.location.reload(); // Refresca toda la app
  };

  return (
    <div className="container-fluid mt-5 px-3">
      <h1 className="text-center mb-2">RSM FINAL PROJECT</h1>
      <OrderForm onReload={handleReloadOrders} />
      <hr />
    </div>
  );
}

export default App;

