import React from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import { ThemeContextType, useTheme } from '../../theme/ThemeContext';
import { createStyles } from './styles';

type AuthInputProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    secureTextEntry?: boolean;
    editable?: boolean;
    error?: string | null;
};

const AuthInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'none',
    secureTextEntry = false,
    editable = true,
    error = null,
}: AuthInputProps) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const inputStyle = editable ? styles.input : styles.inputDisabled;

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#8b8b8b"
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                editable={editable}
                style={inputStyle}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

export default AuthInput;
