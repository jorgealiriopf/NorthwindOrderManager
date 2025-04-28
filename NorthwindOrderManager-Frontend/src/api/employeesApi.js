import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/employees';

export const getEmployees = () => axios.get(BASE_URL);
