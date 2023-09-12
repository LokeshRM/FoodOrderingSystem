import React from 'react';

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  orders : [],
  addItem: item => {},
  removeItem: id => {},
  addOrder : order => {},
  clearCart: () => {},
});

export default CartContext;
