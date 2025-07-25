import { useEffect, useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import AppNavigator from "./navigation/AppNavigator";
import * as SplashScreen from "expo-splash-screen";
import { MovieProvider } from "./context/MovieContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <RootSiblingParent>
      <MovieProvider>
        <AppNavigator />
      </MovieProvider>
    </RootSiblingParent>
  );
}
