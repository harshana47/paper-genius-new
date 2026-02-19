import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_SESSION_STORAGE_KEY } from '../constants';
import { AuthSession } from '../types';

type StoredSessionShape = {
    isLoggedIn?: boolean;
    token?: unknown;
    username?: unknown;
    refreshToken?: unknown;
    rawResponse?: unknown;
};

const normalizeSession = (payload: StoredSessionShape): AuthSession | null => {
    if (!payload?.isLoggedIn || typeof payload?.token !== 'string') {
        return null;
    }

    return {
        isLoggedIn: true,
        token: payload.token,
        username:
            typeof payload.username === 'string' && payload.username.trim().length > 0
                ? payload.username.trim()
                : '',
        refreshToken:
            typeof payload.refreshToken === 'string' ? payload.refreshToken : null,
        rawResponse: payload.rawResponse ?? null,
    };
};

export const saveAuthSession = async (session: AuthSession) => {
    await AsyncStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const loadAuthSession = async () => {
    try {
        const rawSession = await AsyncStorage.getItem(USER_SESSION_STORAGE_KEY);
        if (!rawSession) {
            return null;
        }

        const parsedSession = JSON.parse(rawSession) as StoredSessionShape;
        return normalizeSession(parsedSession);
    } catch (error) {
        console.log('Failed to load auth session', error);
        return null;
    }
};

export const clearAuthSession = async () => {
    await AsyncStorage.removeItem(USER_SESSION_STORAGE_KEY);
};
