import { StyleSheet } from 'react-native';
import { ColorsType } from '../../theme/ThemeContext';
import { verticalScale } from 'react-native-size-matters';

export const createStyles = (colors: ColorsType) =>
    StyleSheet.create({
        primaryBtn: {
            height: verticalScale(50),
            backgroundColor: colors.primary,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
        },
        primaryBtnText: {
            color: colors.background,
            textAlign: 'center',
        },
        disableBtnText: {
            color: colors.primary,
            textAlign: 'center',
        },
        secondaryBtn: {
            height: verticalScale(50),
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
        },
        secondaryBtnText: {
            color: colors.primary,
            textAlign: 'center',
        },
        disableBtn: {
            height: verticalScale(50),
            backgroundColor: colors.primary,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
        },
    });
