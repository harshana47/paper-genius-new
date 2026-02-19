import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { requestNewOtp, validateUser } from '../../services/authApi';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../utils/validators';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CheckUser'>;

const CheckUserScreen = ({ navigation }: Props) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleContinue = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        setErrorMessage('');

        if (!isValidEmail(normalizedEmail)) {
            setErrorMessage('Enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const validationResult = await validateUser(normalizedEmail);
            if (validationResult.exists) {
                if (validationResult.accountStatus === 'VERIFIED') {
                    navigation.replace('Signup', { username: normalizedEmail });
                    return;
                }
                navigation.replace('Login', { username: normalizedEmail });
                return;
            }

            await requestNewOtp(normalizedEmail);
            navigation.navigate('VerifyOtp', { username: normalizedEmail });
        } catch (error: any) {
            setErrorMessage(error?.message ?? 'Unable to continue with this email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.heading}>Continue with Email</Text>
                <Text style={styles.subtitle}>
                    We will check if the user exists. If not, we will send a new OTP
                    for account creation.
                </Text>

                <AuthInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {errorMessage ? (
                    <Text style={styles.inlineError}>{errorMessage}</Text>
                ) : null}

                <AuthButton
                    title="Continue"
                    onPress={handleContinue}
                    disabled={email.trim().length === 0}
                    loading={loading}
                />
            </View>
        </View>
    );
};

export default CheckUserScreen;
