// src/api/productsApi.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/products'; // Ajusta si tu endpoint es diferente.

export const getProducts = () => 
  axios.get(BASE_URL).then(response => response.data);
