import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import {
    AUTH_BASE_URL,
    AUTH_ORIGIN,
    AUTH_REFERER,
    AUTH_TENANT_ID,
} from '../constants';
import { AuthSession, LoginPayload, SignupPayload, VerifyOtpPayload } from '../types';

export type UserValidationResult = {
    exists: boolean;
    accountStatus: string | null;
    loginType: string | null;
    rawResponse: unknown;
};

const authClient = axios.create({
    baseURL: AUTH_BASE_URL,
    timeout: 25000,
    headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: AUTH_ORIGIN,
        referer: AUTH_REFERER,
        'x-tenant-id': AUTH_TENANT_ID,
    },
});

const resolveBoolean = (value: unknown): boolean | null => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        if (value === 1) {
            return true;
        }
        if (value === 0) {
            return false;
        }
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();
        if (normalizedValue === 'true') {
            return true;
        }
        if (normalizedValue === 'false') {
            return false;
        }
        if (
            normalizedValue.includes('exist') &&
            !normalizedValue.includes('not exist')
        ) {
            return true;
        }
        if (
            normalizedValue.includes('not found') ||
            normalizedValue.includes('not exist')
        ) {
            return false;
        }
    }

    return null;
};

const parseUserExists = (payload: any): boolean | null => {
    const candidates: unknown[] = [
        payload,
        payload?.exists,
        payload?.isExists,
        payload?.isExisting,
        payload?.userExists,
        payload?.data,
        payload?.data?.exists,
        payload?.data?.isExists,
        payload?.data?.isExisting,
        payload?.result,
        payload?.result?.exists,
    ];

    for (const candidate of candidates) {
        const resolvedValue = resolveBoolean(candidate);
        if (resolvedValue !== null) {
            return resolvedValue;
        }
    }

    const messageCandidates = [
        payload?.message,
        payload?.error,
        payload?.detail,
        payload?.data?.message,
    ];

    for (const message of messageCandidates) {
        const resolvedValue = resolveBoolean(message);
        if (resolvedValue !== null) {
            return resolvedValue;
        }
    }

    return null;
};

const getErrorMessage = (error: AxiosError, fallbackMessage: string) => {
    const responseData: any = error.response?.data;
    const messageFromResponse =
        responseData?.message ?? responseData?.error ?? responseData?.detail;

    if (typeof messageFromResponse === 'string' && messageFromResponse.length > 0) {
        return messageFromResponse;
    }

    if (typeof error.message === 'string' && error.message.length > 0) {
        return error.message;
    }

    return fallbackMessage;
};

const parseRequestData = (rawRequestData: unknown) => {
    if (typeof rawRequestData !== 'string') {
        return rawRequestData;
    }

    try {
        return JSON.parse(rawRequestData);
    } catch {
        return rawRequestData;
    }
};

const redactSensitiveData = (data: unknown) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return data;
    }

    const clonedData: Record<string, unknown> = {
        ...(data as Record<string, unknown>),
    };

    if (typeof clonedData.password === 'string') {
        clonedData.password = '***';
    }

    if (typeof clonedData.code === 'string') {
        clonedData.code = '***';
    }

    if (typeof clonedData.otp === 'string') {
        clonedData.otp = '***';
    }

    return clonedData;
};

const logAuthRequestFailure = (
    operation: string,
    error: AxiosError,
    context: Record<string, unknown> = {},
) => {
    const requestData = parseRequestData(error.config?.data);
    const redactedRequestData = redactSensitiveData(requestData);
    const fullUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;

    console.log(`[AUTH][${operation}] request failed`, {
        ...context,
        message: error.message,
        statusCode: error.response?.status ?? null,
        url: fullUrl,
        method: error.config?.method?.toUpperCase() ?? null,
        requestHeaders: error.config?.headers ?? null,
        requestData: redactedRequestData ?? null,
        responseHeaders: error.response?.headers ?? null,
        responseData: error.response?.data ?? null,
    });
};

const extractToken = (payload: any) => {
    const tokenCandidates = [
        payload?.token,
        payload?.accessToken,
        payload?.access_token,
        payload?.data?.token,
        payload?.data?.accessToken,
        payload?.data?.access_token,
        payload?.result?.token,
    ];

    for (const tokenCandidate of tokenCandidates) {
        if (
            typeof tokenCandidate === 'string' &&
            tokenCandidate.trim().length > 0
        ) {
            return tokenCandidate.trim();
        }
    }

    return null;
};

const extractRefreshToken = (payload: any) => {
    const tokenCandidates = [
        payload?.refreshToken,
        payload?.refresh_token,
        payload?.data?.refreshToken,
        payload?.data?.refresh_token,
    ];

    for (const tokenCandidate of tokenCandidates) {
        if (
            typeof tokenCandidate === 'string' &&
            tokenCandidate.trim().length > 0
        ) {
            return tokenCandidate.trim();
        }
    }

    return null;
};

export const buildLoginPayload = (username: string, password: string): LoginPayload => {
    const timestamp = Date.now();
    const normalizedPlatform = Platform.OS.toUpperCase();

    return {
        username,
        password,
        deviceId: `rn-${normalizedPlatform}-${timestamp}`,
        deviceName: `${normalizedPlatform}-${String(Platform.Version)}`,
        platform: 'WEB',
    };
};

const toUpperStatus = (value: unknown) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return null;
    }
    return value.trim().toUpperCase();
};

export const validateUser = async (
    username: string,
): Promise<UserValidationResult> => {
    try {
        const response = await authClient.get(
            `/auth/validate/${encodeURIComponent(username)}`,
        );
        const payload = response.data;
        const isUserExisting = parseUserExists(payload);

        if (isUserExisting === false) {
            return {
                exists: false,
                accountStatus: null,
                loginType: null,
                rawResponse: payload,
            };
        }

        const accountStatus = toUpperStatus(
            payload?.accountStatus ?? payload?.data?.accountStatus,
        );
        const loginType =
            typeof payload?.loginType === 'string'
                ? payload.loginType
                : typeof payload?.data?.loginType === 'string'
                    ? payload.data.loginType
                    : null;
        const hasIdentity =
            typeof payload?.id === 'number' ||
            typeof payload?.id === 'string' ||
            typeof payload?.username === 'string';

        if (isUserExisting === true || hasIdentity) {
            return {
                exists: true,
                accountStatus,
                loginType,
                rawResponse: payload,
            };
        }

        throw new Error('Unable to identify user status from validation response.');
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return {
                    exists: false,
                    accountStatus: null,
                    loginType: null,
                    rawResponse: error.response?.data ?? null,
                };
            }
            throw new Error(getErrorMessage(error, 'Failed to validate user.'));
        }
        throw error;
    }
};

export const validateUserExists = async (username: string) => {
    const validationResult = await validateUser(username);
    return validationResult.exists;
};

export const requestNewOtp = async (username: string) => {
    try {
        await authClient.post('/auth/new-otp', { username });
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(getErrorMessage(error, 'Failed to send OTP.'));
        }
        throw error;
    }
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
    try {
        await authClient.post('/auth/verify-otp', payload);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(getErrorMessage(error, 'Failed to verify OTP.'));
        }
        throw error;
    }
};

export const signUp = async (payload: SignupPayload) => {
    try {
        await authClient.post('/signup', payload);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(getErrorMessage(error, 'Failed to signup.'));
        }
        throw error;
    }
};

export const login = async (payload: LoginPayload): Promise<AuthSession> => {
    try {
        const response = await authClient.post('/auth/login', payload);
        const token = extractToken(response.data);
        const refreshToken = extractRefreshToken(response.data);

        if (!token) {
            throw new Error('Login response does not include an access token.');
        }

        return {
            isLoggedIn: true,
            token,
            username: payload.username,
            refreshToken,
            rawResponse: response.data,
        };
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logAuthRequestFailure('LOGIN', error, {
                username: payload.username,
                tenantId: AUTH_TENANT_ID,
            });

            const normalizedError = new Error(getErrorMessage(error, 'Failed to login.')) as Error & {
                statusCode?: number;
                responseData?: unknown;
            };

            normalizedError.statusCode = error.response?.status;
            normalizedError.responseData = error.response?.data;
            throw normalizedError;
        }
        throw error;
    }
};
