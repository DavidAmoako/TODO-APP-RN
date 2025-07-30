import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { api } from '@/convex/_generated/api';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

/**
 * DangerZone Component
 * Provides destructive actions that can permanently alter or delete user data
 * Styled with warning colors and requires user confirmation for safety
 */
const DangerZone = () => {
    // Get current theme colors for consistent styling
    const { colors } = useTheme();

    // Create theme-aware styles for settings components
    const settingStyles = createSettingsStyles(colors);

    // Convex mutation hook to clear all todos from database
    const clearAllTodos = useMutation(api.todos.clearAllTodos);

    /**
     * Handle App Reset Function
     * Clears all user data with confirmation dialogs for safety
     * Provides user feedback on operation success/failure
     */
    const handleResetApp = async () => {
        // First confirmation dialog - prevents accidental clicks
        Alert.alert(
            "Reset App",
            "⚠️ This will delete all your todos and cannot be undone. Are you sure you want to proceed?",
            [
                // Cancel option - styled as safe action
                { text: "Cancel", style: "cancel" },
                {
                    // Destructive action - styled with red/warning colors
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Execute the database clear operation
                            const result = await clearAllTodos();
                            
                            // Success feedback with count of deleted items
                            Alert.alert(
                                "App Reset", 
                                `Successfully deleted ${result.deletedCount} todo${result.deletedCount === 1 ? "" : "s"}. Your app has been reset.`,
                            );
                        } catch (error) {
                            // Error handling with user-friendly message
                            console.log("Error deleting all todos:", error);
                            Alert.alert("Error", "Failed to reset app");
                        }
                    }
                }
            ]
        )
    }

    return (
        // Section container with surface gradient for visual depth
        <LinearGradient colors={colors.gradients.surface} style={settingStyles.section}>
            {/* Section title with danger styling to indicate risk */}
            <Text style={settingStyles.sectionTitleDanger}>Danger Zone</Text>
            
            {/* Reset app button with warning visual indicators */}
            <TouchableOpacity
                style={[settingStyles.actionButton, { borderBottomWidth: 0 }]}
                onPress={handleResetApp}
                activeOpacity={0.7} // Visual feedback on press
            >
                {/* Left side: Icon and text */}
                <View style={settingStyles.actionLeft}>
                    {/* Danger-colored icon container */}
                    <LinearGradient colors={colors.gradients.danger} style={settingStyles.actionIcon}>
                        <Ionicons name="trash" size={18} color="#fff" />
                    </LinearGradient>
                    {/* Action text styled with danger colors */}
                    <Text style={settingStyles.actionTextDanger}>Reset App</Text>
                </View>
                
                {/* Right side: Chevron indicator */}
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default DangerZone