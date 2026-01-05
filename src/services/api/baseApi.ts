import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenStorage } from "../../utils/tokenStorage";
import type { RootState } from "../../app/store";

// שימי כאן את ה-URL של השרת שלך (לוקלי)
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState;
      const tokenFromState = state.auth?.token;
      const token = tokenFromState ?? tokenStorage.get();

      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");

      return headers;
    },
  }),
  endpoints: () => ({}), 
  tagTypes: [
    // Auth & User
    "Me",
    
    // Students
    "Student",
    "Students",
    "StudentsByTeacher",
    "StudentsBySchool",
    
    // Assessments
    "Assessment",
    "Assessments",
    "AssessmentsByStudent",
    
    // Statistics
    "Stats",
  ],
});