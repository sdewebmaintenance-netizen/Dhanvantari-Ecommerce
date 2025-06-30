import { apiSlice } from "./apiSlice";
import { INCO_TERM_URL } from "../../config/config";

export const incoTermApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createIncoTerm: builder.mutation({
      query: (newIncoTerm) => ({
        url: `${INCO_TERM_URL}`,
        method: "POST",
        body: newIncoTerm,
      }),
    }),

    updateIncoTerm: builder.mutation({
      query: ({ incoTermId, updatedIncoTerm }) => ({
        url: `${INCO_TERM_URL}/${incoTermId}`,
        method: "PUT",
        body: updatedIncoTerm,
      }),
    }),

    deleteIncoTerm: builder.mutation({
      query: (incoTermId) => ({
        url: `${INCO_TERM_URL}/${incoTermId}`,
        method: "DELETE",
      }),
    }),

    fetchIncoTerms: builder.query({
      query: () => `/incoTerm`,
    }),
  }),
});

export const {
  useCreateIncoTermMutation,
  useUpdateIncoTermMutation,
  useDeleteIncoTermMutation,
  useFetchIncoTermsQuery,
} = incoTermApiSlice;
