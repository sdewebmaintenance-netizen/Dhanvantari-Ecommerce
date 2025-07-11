import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../../config/config";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRazorPayKeyId: builder.query({
      query: () => `${ORDERS_URL}/getKey`,
    }),

    createRazorPayOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}/createRazorPayOrder`,
        method: "POST",
        body: order,
      }),
    }),

    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}/create-order`,
        method: "POST",
        body: order,
      }),
    }),

    orderConfirmationViaEmails: builder.mutation({
      query: (orderdata) => ({
        url: `${ORDERS_URL}/orderConfirmationViaEmails`,
        method: "POST",
        body: orderdata
      }),
    }),

    uploadInvoice: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}/upload-invoice`,
        method: "POST",
        body: order
      }),
    }),

    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "DELETE",
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/getAllOrders`,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetRazorPayKeyIdQuery,
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateRazorPayOrderMutation,
  useGetOrderDetailsQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useOrderConfirmationViaEmailsMutation,
  useUploadInvoiceMutation,
} = orderApiSlice;
