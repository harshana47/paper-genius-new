import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { ColorsType } from '../../../theme/ThemeContext';

export const createStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: moderateScale(20),
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            color: '#1f1f1f',
            fontSize: moderateScale(24),
            fontFamily: 'Manrope-SemiBold',
            marginBottom: verticalScale(10),
        },
        subtitle: {
            color: '#4b4b4b',
            fontSize: moderateScale(14),
            fontFamily: 'Manrope-Regular',
            marginBottom: verticalScale(24),
            textAlign: 'center',
        },
        logoutButton: {
            width: '100%',
            height: verticalScale(50),
            borderRadius: moderateScale(10),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoutText: {
            color: colors.background,
            fontSize: moderateScale(14),
            fontFamily: 'Manrope-SemiBold',
        },
    });
