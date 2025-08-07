import { apiSlice } from "./apiSlice";
import { SHIPPING_ADDRESS_URL } from "../../config/config";

export const shippingAddressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShippingAddress: builder.mutation({
      query: (newShippingAddress) => ({
        url: `${SHIPPING_ADDRESS_URL}`,
        method: "POST",
        body: newShippingAddress,
      }),
    }),

    updateShippingAddress: builder.mutation({
      query: ({ shippingAddressId, updatedShippingAddress }) => ({
        url: `${SHIPPING_ADDRESS_URL}/${shippingAddressId}`,
        method: "PUT",
        body: updatedShippingAddress,
      }),
    }),

    deleteShippingAddress: builder.mutation({
      query: (shippingAddressId) => ({
        url: `${SHIPPING_ADDRESS_URL}/${shippingAddressId}`,
        method: "DELETE",
      }),
    }),

    fetchShippingAddress: builder.query({
      query: () => `${SHIPPING_ADDRESS_URL}/shippingAddress`,
    }),

    fetchAllShippingAddress: builder.query({
      query: () => `${SHIPPING_ADDRESS_URL}/listAllShippingAddress`,
    }),
  }),
});

export const {
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useFetchShippingAddressQuery,
  useFetchAllShippingAddressQuery,
} = shippingAddressApiSlice;
