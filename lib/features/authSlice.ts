import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      console.log('setCredentials', action.payload);
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const refreshAccessToken = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('http://localhost:5000/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });

    if (response.ok) {
      // Assuming the backend sets the new access token in the cookies
      const user = await response.json();
      dispatch(setCredentials({ user }));
    } else {
      dispatch(logout());
    }
  } catch (err) {
    console.error('Failed to refresh token:', err);
    dispatch(logout());
  }
};

export default authSlice.reducer;
