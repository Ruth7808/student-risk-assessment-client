import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenStorage } from "../../utils/tokenStorage";
import type { RootState } from "../../app/store";

// שימי כאן את ה-URL של השרת שלך (לוקלי)
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, api) => {
      // עדיפות ל-token מה-store (אם קיים), אחרת localStorage
      const state = api.getState() as RootState;
      const tokenFromState = state.auth?.token;
      const token = tokenFromState ?? tokenStorage.get();

      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");

      return headers;
    },
  }),
  endpoints: () => ({}), // חשוב: ריק, וכל פיצ'ר עושה injectEndpoints
  tagTypes: ["Me", "Students", "Assessments", "Stats"], // אופציונלי לעתיד
});
