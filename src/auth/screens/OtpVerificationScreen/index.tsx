import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../../features/stateHooks';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import { setSession } from '../../slices/authSlice';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import {
    buildLoginOtpVerifyPayload,
    requestLoginOtp,
    requestNewOtp,
    verifyLoginOtp,
    verifyOtp,
} from '../../services/authApi';
import { saveAuthSession } from '../../services/authStorage';
import { AuthStackParamList } from '../../navigation/types';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const OtpVerificationScreen = ({ navigation, route }: Props) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const dispatch = useAppDispatch();
    const { username, isExistingUser, shouldGoProfileCreation, otpFlow } = route.params;
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleVerifyOtp = async () => {
        const normalizedCode = otpCode.trim();
        setErrorMessage('');

        if (normalizedCode.length < 4) {
            setErrorMessage('Enter the OTP code sent to your email or mobile number.');
            return;
        }

        setLoading(true);
        try {
            if (otpFlow === 'login-otp') {
                const loginOtpPayload = buildLoginOtpVerifyPayload(
                    username,
                    normalizedCode,
                );
                console.log('[AUTH][OTP_VERIFY] verifying login otp', {
                    username,
                    deviceId: loginOtpPayload.deviceId,
                    deviceName: loginOtpPayload.deviceName,
                    platform: loginOtpPayload.platform,
                });
                const session = await verifyLoginOtp(loginOtpPayload);
                await saveAuthSession(session);
                dispatch(setSession(session));
                return;
            }

            await verifyOtp({ username, code: normalizedCode });

            if (shouldGoProfileCreation || !isExistingUser) {
                navigation.replace('Signup', { username });
                return;
            }

            setErrorMessage('User flow is invalid. Please request a new OTP.');
        } catch (error: any) {
            setErrorMessage(error?.message ?? 'OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setErrorMessage('');
        setResending(true);
        try {
            if (otpFlow === 'login-otp') {
                await requestLoginOtp(username);
            } else {
                await requestNewOtp(username);
            }
        } catch (error: any) {
            setErrorMessage(error?.message ?? 'Unable to resend OTP.');
        } finally {
            setResending(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Verify OTP</Text>
            <Text style={styles.subtitle}>
                We sent an OTP to {username}. Enter it to continue.
            </Text>

            <AuthInput
                label="OTP Code"
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="6 digit code"
                keyboardType="number-pad"
            />

            {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

            <AuthButton
                title="Verify OTP"
                onPress={handleVerifyOtp}
                disabled={otpCode.trim().length === 0}
                loading={loading}
            />

            <TouchableOpacity
                style={styles.linkButton}
                onPress={handleResendOtp}
                disabled={resending}>
                <Text style={styles.linkText}>
                    {resending ? 'Resending OTP...' : 'Resend OTP'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default OtpVerificationScreen;
