import { ActivityIndicator, StyleSheet, View } from "react-native";

type loadingViewProps = {
  styleProps?: {};
};
export const LoadingView = ({ styleProps }: loadingViewProps) => {
  return (
    <View style={styleProps || localStyle}>
      <ActivityIndicator size={"large"} />
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentLoader: {
    height: "88%",
    justifyContent: "center",
  },
});
export default LoadingView;
