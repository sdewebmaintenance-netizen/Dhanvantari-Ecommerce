import { apiSlice } from "./apiSlice";
import { PORT_URL } from "../../config/config";

export const portApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPort: builder.mutation({
      query: (newPort) => ({
        url: `${PORT_URL}`,
        method: "POST",
        body: newPort,
      }),
    }),

    updatePort: builder.mutation({
      query: ({ portId, updatedPort }) => ({
        url: `${PORT_URL}/${portId}`,
        method: "PUT",
        body: updatedPort,
      }),
    }),

    deletePort: builder.mutation({
      query: (portId) => ({
        url: `${PORT_URL}/${portId}`,
        method: "DELETE",
      }),
    }),

    fetchPorts: builder.query({
      query: () => `/ports`,
    }),
  }),
});

export const {
  useCreatePortMutation,
  useUpdatePortMutation,
  useDeletePortMutation,
  useFetchPortsQuery,
} = portApiSlice;
