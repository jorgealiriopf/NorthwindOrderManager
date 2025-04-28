import { useState } from 'react';
import { getOrderDetails } from '../api/ordersApi';

const useOrderLines = () => {
  const [lines, setLines] = useState([]);

  const loadLines = async (orderId) => {
    try {
      if (!orderId) {
        setLines([]);
        return;
      }
      const response = await getOrderDetails(orderId);
      setLines(response.data || []);
    } catch (error) {
      console.error('Error loading order details:', error);
      setLines([]);
    }
  };

  const addLine = (newLine) => {
    setLines(prev => [...prev, newLine]);
  };

  const updateLine = (index, updatedLine) => {
    setLines(prev => prev.map((line, idx) => idx === index ? updatedLine : line));
  };

  const deleteLine = (index) => {
    setLines(prev => prev.filter((_, idx) => idx !== index));
  };

  const clearLines = () => {
    setLines([]);
  };

  return {
    lines,
    loadLines,
    addLine,
    updateLine,
    deleteLine,
    clearLines,
  };
};

export default useOrderLines;
