import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Button,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";

function showToast() {
  if (Platform.OS === "android") {
    ToastAndroid.show("Hello World", ToastAndroid.SHORT);
  } else {
    Alert.alert("Hi there!");
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Press me" onPress={showToast} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
