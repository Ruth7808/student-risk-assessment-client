import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "../../utils/tokenStorage";

export type UserRole = "admin" | "principal" | "teacher";

export type AuthUser = {
  id: string;
  fullName: string;
  role: UserRole;
  isFirstLogin?: boolean;
  isActive?: boolean;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  token: tokenStorage.get(),
  user: null, // נטען אחרי login/register; אפשר גם לשמור ולהרים מ-localStorage אם רוצים
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      tokenStorage.set(action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      tokenStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
