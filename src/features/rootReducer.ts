import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from '../auth/slices/authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
