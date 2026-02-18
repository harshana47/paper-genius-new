import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserState } from '../../models/userModel';
import { privateRequests } from '../../services/api';

const INITIAL_STATE: IUserState = {
    user_id: null,
    unique_id: null,
    name: null,
    mobileNo: null,
    image: null,
    online_status: null,
    country_code: null,
    country_id: null,
    currency: null,
    apiStatus: null,
    logs: [],
};

export const requestGetUser = createAsyncThunk(
    '/user/details',
    async (_, { rejectWithValue }) => {
        try {
            const res = await privateRequests.get('/driver/profile');
            return res?.data;
        } catch (error: any) {
            console.log('user details', error);
            return rejectWithValue(error);
        }
    },
);

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        resetLoggedUserDetails: () => INITIAL_STATE,
        addLog: (state: IUserState, action) => {
            const newLog = action.payload;
            state.logs.unshift(newLog); // add to front
            if (state.logs.length > 200) {
                state.logs.pop(); // remove last
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(requestGetUser.fulfilled, (state: IUserState, action) => {
            state.user_id = action.payload.data?.id;
            state.unique_id = action.payload.data?.unique_id;
            state.name = action.payload.data?.user?.name;
            state.mobileNo = action.payload.data?.user.contact;
            state.image = action.payload.data?.user?.image;
            state.online_status = action.payload.data?.online_status;
            state.country_code = action.payload.data?.user?.country_code;
            state.country_id = action.payload.data?.user?.country_id;
            state.currency = action.payload.data?.user?.country.currency_symbol;
            state.apiStatus = 'Success';
        });
        builder.addCase(requestGetUser.rejected, (state: IUserState, action) => {
            state.apiStatus = 'Failed';
        });
    },
});

export const { resetLoggedUserDetails, addLog } = userSlice.actions;

export default userSlice.reducer;
