// src/api/productsApi.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/products'; // O ajusta al endpoint real de tu API backend

export const getProducts = () => 
  axios.get(BASE_URL).then(response => response.data);
