import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSession } from '../types';

type AuthState = {
    isHydrated: boolean;
    isLoggedIn: boolean;
    token: string | null;
    username: string | null;
    refreshToken: string | null;
};

const INITIAL_STATE: AuthState = {
    isHydrated: false,
    isLoggedIn: false,
    token: null,
    username: null,
    refreshToken: null,
};

const applySession = (state: AuthState, session: AuthSession | null) => {
    if (!session) {
        state.isLoggedIn = false;
        state.token = null;
        state.username = null;
        state.refreshToken = null;
        return;
    }

    state.isLoggedIn = true;
    state.token = session.token;
    state.username = session.username;
    state.refreshToken = session.refreshToken;
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        hydrateSession: (state, action: PayloadAction<AuthSession | null>) => {
            applySession(state, action.payload);
            state.isHydrated = true;
        },
        setSession: (state, action: PayloadAction<AuthSession>) => {
            applySession(state, action.payload);
            state.isHydrated = true;
        },
        clearSession: state => {
            applySession(state, null);
            state.isHydrated = true;
        },
    },
});

export const { hydrateSession, setSession, clearSession } = authSlice.actions;

export default authSlice.reducer;
