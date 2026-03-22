import { View, Text } from "react-native";

export default function Dashboard() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Hverdagsagenten</Text>
      <Text style={{ marginTop: 8, color: "#666" }}>Dine aktive overvåkninger</Text>
    </View>
  );
}
