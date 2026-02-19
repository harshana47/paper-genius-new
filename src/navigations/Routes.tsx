import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import AuthStack from '../auth/navigation/AuthStack';
import UserStack from '../user/navigation/UserStack';
import { useAppDispatch, useAppSelector } from '../features/stateHooks';
import { ThemeContextType, useTheme } from '../theme/ThemeContext';
import { hydrateSession } from '../auth/slices/authSlice';
import { loadAuthSession } from '../auth/services/authStorage';
import { createStyles } from './styles';

const Routes = () => {
  const { isHydrated, isLoggedIn } = useAppSelector(state => state.auth);
  const { colors }: ThemeContextType = useTheme();
  const styles = createStyles(colors);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    const hydrateAuthState = async () => {
      const session = await loadAuthSession();
      if (mounted) {
        dispatch(hydrateSession(session));
      }
    };

    hydrateAuthState();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
