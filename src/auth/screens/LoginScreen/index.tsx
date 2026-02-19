import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../../features/stateHooks';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import { setSession } from '../../slices/authSlice';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { buildLoginPayload, login, validateUser } from '../../services/authApi';
import { saveAuthSession } from '../../services/authStorage';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../utils/validators';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ route, navigation }: Props) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState(route.params.username);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        setErrorMessage('');

        if (!isValidEmail(normalizedEmail)) {
            setErrorMessage('Enter a valid email address.');
            return;
        }

        if (password.trim().length === 0) {
            setErrorMessage('Password is required.');
            return;
        }

        setLoading(true);
        try {
            const loginPayload = buildLoginPayload(normalizedEmail, password);
            const session = await login(loginPayload);
            await saveAuthSession(session);
            dispatch(setSession(session));
        } catch (error: any) {
            console.log('[AUTH][LOGIN_SCREEN] login failed', {
                username: normalizedEmail,
                statusCode: error?.statusCode ?? null,
                message: error?.message ?? null,
                responseData: error?.responseData ?? null,
            });

            if (error?.statusCode === 403) {
                try {
                    const validationResult = await validateUser(normalizedEmail);
                    if (validationResult.exists && validationResult.accountStatus === 'VERIFIED') {
                        navigation.replace('Signup', { username: normalizedEmail });
                        return;
                    }
                } catch (validationError: any) {
                    console.log('[AUTH][LOGIN_SCREEN] validation lookup failed', {
                        username: normalizedEmail,
                        message: validationError?.message ?? null,
                    });
                }

                setErrorMessage(
                    `Forbidden (403): ${error?.message ?? 'Login is not allowed.'}`,
                );
                return;
            }

            setErrorMessage(error?.message ?? 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseAnotherEmail = () => {
        navigation.replace('CheckUser');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <Text style={styles.subtitle}>
                Existing users can login directly with email and password.
            </Text>

            <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
            />

            {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

            <AuthButton
                title="Login"
                onPress={handleLogin}
                disabled={email.trim().length === 0 || password.trim().length === 0}
                loading={loading}
            />

            <TouchableOpacity
                style={styles.linkButton}
                onPress={handleUseAnotherEmail}>
                <Text style={styles.linkText}>Use another email</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
