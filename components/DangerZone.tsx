import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { api } from '@/convex/_generated/api';
import useDeviceId from '@/hooks/useDeviceId';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

/**
 * DangerZone Component
 * Provides destructive actions that can permanently alter or delete user data
 * Only affects data belonging to the current device for proper user isolation
 * Styled with warning colors and requires user confirmation for safety
 */
const DangerZone = () => {
    // Get current theme colors for consistent styling
    const { colors } = useTheme();

    // Get device ID for user-specific data operations
    const { deviceId } = useDeviceId();

    // Create theme-aware styles for settings components
    const settingStyles = createSettingsStyles(colors);

    // Convex mutation hook to clear all todos for the current device
    const clearAllTodos = useMutation(api.todos.clearAllTodos);

    /**
     * Handle App Reset Function
     * Clears all user data for the current device with confirmation dialogs for safety
     * Provides user feedback on operation success/failure
     * Only deletes todos belonging to the current device
     */
    const handleResetApp = async () => {
        // Safety check: Don't proceed if device ID is not available
        if (!deviceId) {
            Alert.alert("Error", "Device not initialized. Please try again.");
            return;
        }

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
                    onPress: () => {
                        // Second confirmation dialog for extra safety
                        Alert.alert(
                            "Final Confirmation",
                            "🚨 This action cannot be reversed. All your todos will be permanently deleted.",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "I'm Sure - Delete Everything",
                                    style: "destructive",
                                    onPress: async () => {
                                        try {
                                            // Execute the database clear operation with device ID
                                            const result = await clearAllTodos({ deviceId });
                                            
                                            // Success feedback with count of deleted items
                                            Alert.alert(
                                                "App Reset Complete", 
                                                `Successfully deleted ${result.deletedCount} todo${result.deletedCount === 1 ? "" : "s"}. Your app has been reset.`,
                                                [
                                                    {
                                                        text: "OK",
                                                        style: "default"
                                                    }
                                                ]
                                            );
                                        } catch (error) {
                                            // Error handling with user-friendly message
                                            console.error("Error deleting all todos:", error);
                                            Alert.alert(
                                                "Error", 
                                                "Failed to reset app. Please try again or contact support if the problem persists.",
                                                [
                                                    {
                                                        text: "OK",
                                                        style: "default"
                                                    }
                                                ]
                                            );
                                        }
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    return (
        <LinearGradient colors={colors.gradients.surface} style={settingStyles.section}>
            <Text style={settingStyles.sectionTitleDanger}>Danger Zone</Text>
            <Text style={settingStyles.dangerWarning}>
                Actions in this section are permanent and cannot be undone. Proceed with caution.
            </Text>
            
            <TouchableOpacity
                style={[
                    settingStyles.actionButton, 
                    { borderBottomWidth: 0 },
                    !deviceId && settingStyles.actionButtonDisabled 
                ]}
                onPress={handleResetApp}
                activeOpacity={0.7} 
                disabled={!deviceId}
            >
                <View style={settingStyles.actionLeft}>
                    <LinearGradient 
                        colors={deviceId ? colors.gradients.danger : colors.gradients.muted} 
                        style={settingStyles.actionIcon}
                    >
                        <Ionicons name="trash" size={18} color="#fff" />
                    </LinearGradient>
                    
                    <View style={settingStyles.actionTextContainer}>
                        <Text style={[
                            settingStyles.actionTextDanger,
                            !deviceId && settingStyles.actionTextDisabled
                        ]}>
                            Reset App
                        </Text>
                        <Text style={settingStyles.actionSubtext}>
                            Delete all todos from this device
                        </Text>
                    </View>
                </View>
                
                <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={deviceId ? colors.textMuted : colors.border} 
                />
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default DangerZone;