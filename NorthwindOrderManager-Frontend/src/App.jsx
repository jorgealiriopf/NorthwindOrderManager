import React from 'react';
import OrderForm from './components/OrderForm';
import logo from './assets/rsm_logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
  const handleReloadOrders = () => {
    window.location.reload(); // Refresca toda la app
  };

  return (
    <div >
      <header>
      </header>
      <main >
        <h1 ></h1>
        <OrderForm onReload={handleReloadOrders} />
        <hr />
      </main>
    </div>
  );
}