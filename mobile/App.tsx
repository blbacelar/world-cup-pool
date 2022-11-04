import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto";
import { Center, NativeBaseProvider, StatusBar } from "native-base";
import { Loading } from './src/components/Loading';
import { SignIn } from "./src/screens/Signin";

import { THEME } from "./src/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_500Medium, Roboto_700Bold})
  return (
    <NativeBaseProvider theme={THEME}>
      <Center flex={1} bgColor="gray.900">
      <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        { fontsLoaded ? <SignIn/> : <Loading />}
      </Center>
    </NativeBaseProvider>
  );
}
