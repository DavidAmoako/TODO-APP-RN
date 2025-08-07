import { createHomeStyles } from "@/assets/styles/home.styles";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
        <View style={homeStyles.emptyContainer}>
            <LinearGradient 
                colors={colors.gradients.empty} 
                style={homeStyles.emptyIconContainer}
            >
                <Ionicons 
                    name="clipboard-outline" 
                    size={60} 
                    color={colors.textMuted} 
                />
            </LinearGradient>
    
            <Text style={homeStyles.emptyText}>No todos yet!</Text>
            
            <Text style={homeStyles.emptySubtext}>
                Add your first todo above to get started
            </Text>
        </View>
    );
};

export default EmptyState;