import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import {
    requestLoginOtp,
    requestNewOtp,
    validateUser,
} from '../../services/authApi';
import { AuthStackParamList } from '../../navigation/types';
import {
    isValidAuthIdentifier,
    normalizeAuthIdentifier,
} from '../../utils/validators';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CheckUser'>;

const CheckUserScreen = ({ navigation }: Props) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleContinue = async () => {
        const normalizedUsername = normalizeAuthIdentifier(username);
        setErrorMessage('');

        if (!isValidAuthIdentifier(normalizedUsername)) {
            setErrorMessage('Enter a valid email or mobile number.');
            return;
        }

        setLoading(true);
        try {
            const validationResult = await validateUser(normalizedUsername);

            const accountStatus = validationResult.accountStatus ?? '';
            const isActiveUser = validationResult.exists && accountStatus === 'ACTIVE';
            const isVerifiedUser =
                validationResult.exists && accountStatus === 'VERIFIED';
            const shouldGoProfileCreation = !isActiveUser;
            const otpFlow: 'new-otp' | 'login-otp' =
                isActiveUser ? 'login-otp' : 'new-otp';

            console.log('[AUTH][CHECK_USER] validation result', {
                username: normalizedUsername,
                exists: validationResult.exists,
                accountStatus: validationResult.accountStatus,
                loginType: validationResult.loginType,
                otpFlow,
                shouldGoProfileCreation,
                isVerifiedUser,
            });

            if (isVerifiedUser) {
                console.log('[AUTH][CHECK_USER] routing verified user to profile creation', {
                    username: normalizedUsername,
                    accountStatus,
                });
                navigation.replace('Signup', { username: normalizedUsername });
                return;
            }

            if (otpFlow === 'login-otp') {
                await requestLoginOtp(normalizedUsername);
            } else {
                await requestNewOtp(normalizedUsername);
            }
            navigation.navigate('VerifyOtp', {
                username: normalizedUsername,
                isExistingUser: validationResult.exists,
                shouldGoProfileCreation,
                otpFlow,
            });
        } catch (error: any) {
            console.log('[AUTH][CHECK_USER] failed', {
                username: normalizedUsername,
                message: error?.message ?? null,
            });
            setErrorMessage(
                error?.message ?? 'Unable to continue with this email or mobile number.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.heading}>Continue with OTP</Text>
                <Text style={styles.subtitle}>
                    We will validate your email or mobile number and send an OTP to
                    continue.
                </Text>

                <AuthInput
                    label="Email / Mobile"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="947XXXXXXXX or name@example.com"
                    keyboardType="default"
                    autoCapitalize="none"
                />

                {errorMessage ? (
                    <Text style={styles.inlineError}>{errorMessage}</Text>
                ) : null}

                <AuthButton
                    title="Continue"
                    onPress={handleContinue}
                    disabled={username.trim().length === 0}
                    loading={loading}
                />
            </View>
        </View>
    );
};

export default CheckUserScreen;
