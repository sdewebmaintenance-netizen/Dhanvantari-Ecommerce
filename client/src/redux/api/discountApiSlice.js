import { apiSlice } from "./apiSlice";
import { DISCOUNT_URL } from "../../config/config";

export const discountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDiscount: builder.mutation({
      query: (newDiscount) => ({
        url: `${DISCOUNT_URL}`,
        method: "POST",
        body: newDiscount,
      }),
    }),

    updateDiscount: builder.mutation({
      query: ({ discountId, updatedDiscount }) => ({
        url: `${DISCOUNT_URL}/${discountId}`,
        method: "PUT",
        body: updatedDiscount,
      }),
    }),

    deleteDiscount: builder.mutation({
      query: (discountId) => ({
        url: `${DISCOUNT_URL}/${discountId}`,
        method: "DELETE",
      }),
    }),

    fetchDiscounts: builder.query({
      query: () => `${DISCOUNT_URL}/discounts`,
    }),
  }),
});

export const {
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useFetchDiscountsQuery,
} = discountApiSlice;
