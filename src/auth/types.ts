export type AuthSession = {
    isLoggedIn: true;
    token: string;
    username: string;
    refreshToken: string | null;
    rawResponse: unknown;
};

export type VerifyOtpPayload = {
    username: string;
    code: string;
};

export type LoginOtpVerifyPayload = VerifyOtpPayload & {
    deviceId: string;
    deviceName: string;
    platform: string;
};

export type SignupPayload = {
    username: string;
    password: string;
    fullName: string;
};

export type LoginPayload = {
    username: string;
    password: string;
    deviceId: string;
    deviceName: string;
    platform: string;
};
