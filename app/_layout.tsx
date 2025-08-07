import { ThemeProvider } from "@/hooks/useTheme";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { LogBox } from 'react-native';

// Add error tracking
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);

// Add console override to track the error
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Text strings must be rendered within a <Text> component')) {
    console.log('=== TEXT ERROR STACK TRACE ===');
    console.trace();
    console.log('==============================');
  }
  originalConsoleError(...args);
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </ConvexProvider>
  );
}
