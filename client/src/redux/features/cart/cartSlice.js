import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
  name: "cart",
   initialState: {
    cartItems: []
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload; 
    },

    addToCart: (state, action) => {
      state.cartItems.push(action.payload); 
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify([]));
    },
  },
});

export const {
  setCartItems,
  addToCart,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
