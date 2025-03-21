import { ActivityIndicator, View } from "react-native";

export const LoadingView = () => {
  return (
    <View
      style={{
        height: "88%",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default LoadingView;
