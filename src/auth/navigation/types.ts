export type AuthStackParamList = {
    CheckUser: undefined;
    VerifyOtp: {
        username: string;
        isExistingUser: boolean;
        shouldGoProfileCreation: boolean;
        otpFlow: 'new-otp' | 'login-otp';
    };
    Signup: {
        username: string;
    };
    Login: {
        username: string;
    };
};
