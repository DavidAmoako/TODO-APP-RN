// Import styles for home screen components
import { createHomeStyles } from "@/assets/styles/home.styles";
// Import custom theme hook for consistent styling
import useTheme from "@/hooks/useTheme";
// Import Ionicons for consistent iconography
import { Ionicons } from "@expo/vector-icons";
// Import LinearGradient for modern visual styling
import { LinearGradient } from "expo-linear-gradient";
// Import React Native components for UI structure
import { Text, View } from "react-native";

/**
 * EmptyState Component
 * Displays a friendly message when the user has no todos in their list
 * Provides visual guidance to encourage user engagement and app usage
 * Improves user experience by explaining what to do when the list is empty
 */
const EmptyState = () => {
    // Get current theme colors for consistent styling across light/dark modes
    const { colors } = useTheme();

    // Create theme-aware styles for home screen components
    const homeStyles = createHomeStyles(colors);

    return (
        // Main container for the empty state message
        <View style={homeStyles.emptyContainer}>
            {/* Icon container with gradient background for visual appeal */}
            <LinearGradient 
                colors={colors.gradients.empty} 
                style={homeStyles.emptyIconContainer}
            >
                {/* Clipboard icon to represent todo lists / tasks */}
                <Ionicons 
                    name="clipboard-outline" 
                    size={60} 
                    color={colors.textMuted} 
                />
            </LinearGradient>
            
            {/* Primary empty state message - encourages user to start adding todos */}
            <Text style={homeStyles.emptyText}>No todos yet!</Text>
            
            {/* Secondary message providing clear guidance on next steps */}
            <Text style={homeStyles.emptySubtext}>
                Add your first todo above to get started
            </Text>
        </View>
    );
};

export default EmptyState;