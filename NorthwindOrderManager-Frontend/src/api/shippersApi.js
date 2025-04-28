import axios from 'axios';

const BASE_URL = 'http://localhost:5027/api/shippers';

export const getShippers = () => axios.get(BASE_URL);
