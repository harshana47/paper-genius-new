import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USER_THEME';

export type ColorsType = {
    primary: string;
    background: string;
};
export type ThemeContextType = {
    isDark: boolean;
    colors: ColorsType;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    colors: {
        primary: '#EB2229',
        background: '#ffffff',

    },
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const lightColors = {
    primary: '#EB2229',
    background: '#ffffff',

};

const darkColors = {
    primary: '#EB2229',
    background: '#ffffff',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }
            } catch (e) {
                console.error('Failed to load theme from storage', e);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = !isDark ? 'dark' : 'light';
            setIsDark(!isDark);
            await AsyncStorage.setItem(STORAGE_KEY, newTheme);
        } catch (e) {
            console.error('Failed to save theme', e);
        }
    };

    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
