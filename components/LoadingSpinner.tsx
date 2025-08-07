import { createHomeStyles } from "@/assets/styles/home.styles";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, View } from "react-native";

/**
 * LoadingSpinner Component
 * Displays a loading screen while data is being fetched from the database
 * Provides visual feedback to users during async operations
 * Prevents blank screens and improves perceived performance
 */
const LoadingSpinner = () => {
    // Get current theme colors for consistent styling across light/dark modes
    const { colors } = useTheme();

    // Create theme-aware styles for home screen components
    const homeStyles = createHomeStyles(colors);

    return (
        <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
            <View style={homeStyles.loadingContainer}>
                
                <ActivityIndicator size="large" color={colors.primary} />

                <Text style={homeStyles.loadingText}>Loading your todos...</Text>
            </View>
        </LinearGradient>
    );
};

export default LoadingSpinner;