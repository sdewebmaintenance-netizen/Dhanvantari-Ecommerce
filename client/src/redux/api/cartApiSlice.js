import { apiSlice } from "./apiSlice";
import { CART_URL } from "../../config/config";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (newCart) => ({
        url: `${CART_URL}`,
        method: "POST",
        body: newCart,
      }),
    }),

    updateCart: builder.mutation({
      query: ({ cartId, updatedCart }) => ({
        url: `${CART_URL}/${cartId}`,
        method: "PUT",
        body: updatedCart,
      }),
    }),

    deleteCart: builder.mutation({
      query: (cartId) => ({
        url: `${CART_URL}/${cartId}`,
        method: "DELETE",
      }),
    }),

    fetchCartForUser: builder.query({
      query: () => `${CART_URL}/cart`,
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}/clear`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useFetchCartForUserQuery,
  useClearCartMutation
} = cartApiSlice;
