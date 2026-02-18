
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/features/store';
import { ThemeProvider } from './src/context/ThemeContext';
import Routes from './src/navigations/Routes';

function App() {


  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Routes />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}


export default App;
