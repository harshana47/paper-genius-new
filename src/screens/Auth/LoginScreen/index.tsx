import { View, Text } from 'react-native'
import React from 'react'
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext'
import { createStyles } from './styles'

const LoginScreen = () => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Text>LoginScreen</Text>
        </View>
    )
}

export default LoginScreen