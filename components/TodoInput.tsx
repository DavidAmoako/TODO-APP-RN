import { createHomeStyles } from '@/assets/styles/home.styles';
import { api } from '@/convex/_generated/api';
import useDeviceId from '@/hooks/useDeviceId';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * TodoInput Component
 * Provides input interface for adding new todos to the database
 * Ensures todos are properly associated with the current device for user isolation
 * Includes validation, error handling, and enhanced user experience features
 */
const TodoInput = () => {
    // Get current theme colors for consistent styling
    const { colors } = useTheme();
    
    // Get device ID for user-specific data operations
    const { deviceId, isLoading: deviceIdLoading } = useDeviceId();
    
    // Create theme-aware styles
    const homeStyles = createHomeStyles(colors);
    
    // State management for todo input and loading states
    const [newTodo, setNewTodo] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    // Convex mutation hook for adding todos to the database
    const addTodo = useMutation(api.todos.addTodo);

    /**
     * Handle Add Todo Function
     * Validates input, adds todo to database with device ID, and provides user feedback
     * Includes comprehensive error handling and loading states
     */
    const handleAddTodo = async () => {
        // Validate input text is not empty after trimming whitespace
        if (!newTodo.trim()) {
            Alert.alert("Invalid Input", "Please enter a todo before adding.");
            return;
        }

        // Validate device ID is available for user association
        if (!deviceId) {
            Alert.alert("Device Error", "Device not initialized. Please try again in a moment.");
            return;
        }

        // Prevent multiple simultaneous submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Add todo to database with device ID for user isolation
            await addTodo({ 
                text: newTodo.trim(), 
                deviceId 
            });

            // Success feedback and cleanup
            setNewTodo(''); // Clear input field
            Keyboard.dismiss(); // Hide keyboard on mobile
            
            // Optional: Show success feedback (can be removed if too intrusive)
            // Alert.alert("Success", "Todo added successfully!");
            
        } catch (error) {
            // Comprehensive error handling with user-friendly messages
            console.error("Error adding todo:", error);
            
            // Determine error type and show appropriate message
            if (error instanceof Error) {
                if (error.message.includes('Device ID is required')) {
                    Alert.alert("Authorization Error", "Please restart the app and try again.");
                } else if (error.message.includes('empty')) {
                    Alert.alert("Invalid Input", "Todo text cannot be empty.");
                } else {
                    Alert.alert("Error", "Failed to add todo. Please check your connection and try again.");
                }
            } else {
                Alert.alert("Error", "An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle text change with validation
     * Provides real-time feedback and prevents overly long todos
     */
    const handleTextChange = (text: string) => {
        // Limit text length for better UX and database efficiency
        if (text.length <= 200) {
            setNewTodo(text);
        }
    };

    /**
     * Handle keyboard submission
     * Allows users to add todos by pressing "Done" on keyboard
     */
    const handleSubmitEditing = () => {
        if (newTodo.trim() && deviceId && !isSubmitting) {
            handleAddTodo();
        }
    };

    // Calculate if the add button should be enabled
    const isAddButtonEnabled = newTodo.trim().length > 0 && deviceId && !isSubmitting && !deviceIdLoading;

    return (
        <View style={homeStyles.inputSection}>
            {/* Input wrapper container */}
            <View style={homeStyles.inputWrapper}>
                {/* Main text input field */}
                <TextInput
                    style={[
                        homeStyles.input,
                        isSubmitting && homeStyles.inputDisabled // Style for loading state
                    ]}
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChangeText={handleTextChange}
                    onSubmitEditing={handleSubmitEditing}
                    placeholderTextColor={colors.textMuted}
                    returnKeyType="done"
                    multiline={false}
                    maxLength={200}
                    editable={!isSubmitting && !deviceIdLoading} // Disable during loading
                    autoCorrect={true} // Enable autocorrect for better UX
                    autoCapitalize="sentences" // Capitalize first letter of sentences
                />
                
                {/* Character count indicator (optional, can be removed) */}
                {newTodo.length > 150 && (
                    <Text style={homeStyles.characterCount}>
                        {newTodo.length}/200
                    </Text>
                )}
                
                {/* Add button with loading and disabled states */}
                <TouchableOpacity 
                    onPress={handleAddTodo} 
                    activeOpacity={0.8} 
                    disabled={!isAddButtonEnabled}
                    style={homeStyles.addButtonContainer}
                >
                    <LinearGradient
                        colors={isAddButtonEnabled ? colors.gradients.primary : colors.gradients.muted}
                        style={[
                            homeStyles.addButton, 
                            !isAddButtonEnabled && homeStyles.addButtonDisabled
                        ]}
                    >
                        {/* Show loading indicator or add icon */}
                        {isSubmitting ? (
                            <Ionicons name="hourglass" size={24} color="#ffffff" />
                        ) : (
                            <Ionicons name="add" size={24} color="#ffffff" />
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Device status indicator (for debugging, can be removed in production) */}
            {!deviceId && !deviceIdLoading && (
                <Text style={homeStyles.deviceStatusError}>
                    Device not ready. Please wait...
                </Text>
            )}
        </View>
    )
}

export default TodoInput