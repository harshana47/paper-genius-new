import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
    OnboardingScreen: undefined;
    GetStartedScreen: undefined;
    SignUpScreen: undefined;
    OTPVerificationScreen: {
        mobileNo: number;
        iso2: string;
        countryCode: string;
        type: 'signUp' | 'logIn' | 'forgotPassword';
    };
    LoginScreen: undefined;
    PrivacyPolicyScreen: undefined;
    LoginWithOTPScreen: { type: 'logIn' | 'forgotPassword' };
    ChangePasswordScreen: {
        mobileNo: number;
        iso2: string;
        countryCode: string;
        isLogged: boolean;
    };
};

export type UserStackParamList = {
    BottomTab: undefined;
    ProfileSetupScreen: undefined;
    AddVehicleScreen: undefined;
    AddDocumentsScreen: { isEdit?: boolean };
    SelectServiceScreen: undefined;
    VerifyProfileScreen: undefined;
    AddBankDetailsScreen: { isEdit?: boolean };
    StartJobScreen: { orderID: number };
    GoRestaurantScreen: { orderID: number };
    CollectOrderScreen: { orderID: number };
    GoCustomerScreen: { orderID: number; isArrived: boolean };
    JobDetailsScreen: { isCancel: boolean };
    TranscationListScreen: undefined;
    BankDetailsScreen: undefined;
    UpdatePasswordScreen: undefined;
    SupportCenterScreen: undefined;
    PrivacyPolicyScreen: undefined;
    DocumentsScreen: undefined;
    NotificationScreen: undefined;
    ResubmitDocumentsScreen: undefined;
    CancelJobScreen: { catergory: string; OrderID: number; stop: number };
    PaymentStatusScreen: undefined;
    WebViewScreen: { paymentUrl: string };
    EarningListScreen: undefined;
    BackgroundLogs: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, Screen>;
