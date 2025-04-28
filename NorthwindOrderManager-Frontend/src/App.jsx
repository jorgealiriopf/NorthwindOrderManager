import OrdersTable from './components/OrdersTable';
import OrderForm from './components/OrderForm';

function App() {
  return (
    <div className="container mt-4">
      <h1>Northwind Order Manager</h1>
      <OrderForm />
      <hr />
      <OrdersTable />
    </div>
  );
}

export default App;
