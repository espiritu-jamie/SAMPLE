import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alerts",
  initialState: {
    loading: false,
    user: {
    },
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

console.log(alertSlice);

export const {
  showLoading,
  hideLoading,
} = alertSlice.actions;


