import { RootSiblingParent } from "react-native-root-siblings";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <RootSiblingParent>
      <AppNavigator />
    </RootSiblingParent>
  );
}
