import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './stack/AuthStack';
import { useEffect, useState } from 'react';
import UserStack from './stack/UserStack';
import { useAppDispatch, useAppSelector } from '../features/stateHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestGetUser } from '../features/slices/userSlice';

const Routes = () => {
  const [userData, setuserData]: any = useState(null);
  const loggedUserData = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const getUserDetails = async () => {
    try {
      const data: any = await AsyncStorage.getItem('UserDetail');
      const localData = await JSON.parse(data);
      setuserData(localData);
      if (localData?.isLoggedIn && loggedUserData?.user_id == null) {
        dispatch(requestGetUser());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const linking: any = {
    prefixes: ['xriders://', 'https://kaadhalae.com'],
    config: {
      screens: {
        BottomTab: {
          screens: {
            WalletScreen: 'payment',
          },
        },
      },
    },
  };

  useEffect(() => {
    getUserDetails();
  }, [loggedUserData]);

  return (
    <NavigationContainer linking={linking}>
      {userData?.isLoggedIn ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
