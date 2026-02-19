export type AuthStackParamList = {
    CheckUser: undefined;
    VerifyOtp: {
        username: string;
    };
    Signup: {
        username: string;
    };
    Login: {
        username: string;
    };
};
