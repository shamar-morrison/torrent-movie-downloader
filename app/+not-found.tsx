import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Film } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Not Found",
          headerStyle: {
            backgroundColor: "#141414",
          },
          headerTintColor: "#ffffff",
        }} 
      />
      <View style={styles.container}>
        <Film size={64} color="#666666" />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.description}>This screen doesn&apos;t exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#141414",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  description: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#e50914",
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
});
