import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { requestNewOtp, verifyOtp } from '../../services/authApi';
import { AuthStackParamList } from '../../navigation/types';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const OtpVerificationScreen = ({ navigation, route }: Props) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const { username } = route.params;
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleVerifyOtp = async () => {
        const normalizedCode = otpCode.trim();
        setErrorMessage('');

        if (normalizedCode.length < 4) {
            setErrorMessage('Enter the OTP code sent to your email.');
            return;
        }

        setLoading(true);
        try {
            await verifyOtp({ username, code: normalizedCode });
            navigation.replace('Signup', { username });
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
            await requestNewOtp(username);
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
                We sent an OTP to {username}. Enter it to continue the signup flow.
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
