import { baseApi } from "../../../services/api/baseApi";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      { message?: string; user?: { isFirstLogin?: boolean } },
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/users/change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useChangePasswordMutation } = authApi;
