import { createSlice } from '@reduxjs/toolkit';

const yourFeatureSlice = createSlice({
  name: 'yourFeature',
  initialState: {
    /* state awal */
  },
  reducers: {
    // definisikan reducer Anda di sini
  },
});

export const {
  /* ekspor action Anda */
} = yourFeatureSlice.actions;
export default yourFeatureSlice.reducer;
