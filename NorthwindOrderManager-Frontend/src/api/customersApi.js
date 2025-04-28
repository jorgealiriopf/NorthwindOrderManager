import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/customers';

export const getCustomers = () => axios.get(BASE_URL);
