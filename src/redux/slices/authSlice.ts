import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  fin_kod: string | null;
  role: number | null;
  token: string | null;
  approved: boolean | null;
  faculty_code: string | null;
  cafedra_code: string | null;
  duty_code: number | null;
}

const initialState: AuthState = {
  fin_kod: null,
  role: null,
  token: null,
  approved: null,
  faculty_code: null,
  cafedra_code: null,
  duty_code: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state: AuthState,
      action: PayloadAction<{
        token: string;
        user: {
          fin_kod: string,
          role: number;
          approved: boolean;
          faculty_code: string;
          cafedra_code: string | null;
          duty_code: number;
        };
      }>
    ) => {
      state.fin_kod = action.payload.user.fin_kod;
      state.role = action.payload.user.role;
      state.token = action.payload.token;
      state.approved = action.payload.user.approved;
      state.faculty_code = action.payload.user.faculty_code;
      state.cafedra_code = action.payload.user.cafedra_code;
      state.duty_code = action.payload.user.duty_code;
    },
    logout: () => initialState,
    clearLoginSteps: (state: AuthState) => {
      state.fin_kod = null;
      state.role = null;
      state.token = null;
      state.approved = null;
      state.faculty_code = null;
      state.cafedra_code = null;
      state.duty_code = null;
    },
  },
});

export const {
  loginSuccess,
  clearLoginSteps,
  logout
} = authSlice.actions;
export default authSlice.reducer;