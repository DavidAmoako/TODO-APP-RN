// Import styles for home screen components
import { createHomeStyles } from "@/assets/styles/home.styles";
// Import custom theme hook for consistent styling
import useTheme from "@/hooks/useTheme";
// Import LinearGradient for modern visual styling
import { LinearGradient } from "expo-linear-gradient";
// Import React Native components for loading UI
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
        // Full-screen gradient background matching the main app design
        <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
            {/* Centered loading content container */}
            <View style={homeStyles.loadingContainer}>
                {/* Native spinning activity indicator */}
                {/* Uses primary theme color for consistency with app branding */}
                <ActivityIndicator size="large" color={colors.primary} />
                
                {/* Loading message to inform users what's happening */}
                {/* Specific text "Loading your todos..." sets proper expectations */}
                <Text style={homeStyles.loadingText}>Loading your todos...</Text>
            </View>
        </LinearGradient>
    );
};

export default LoadingSpinner;