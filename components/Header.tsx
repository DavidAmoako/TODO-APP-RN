import { createHomeStyles } from '@/assets/styles/home.styles';
import { api } from '@/convex/_generated/api';
import useDeviceId from '@/hooks/useDeviceId'; // Import device ID hook
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

/**
 * Header Component
 * Displays the app title, progress statistics, and completion tracking
 * Provides real-time updates of todo completion status with visual progress indicators
 * Shows motivational messaging and current productivity metrics for the specific device
 */
const Header = () => {
    // Get current theme colors for consistent styling across light/dark modes
    const { colors } = useTheme();

    // Get device ID for user-specific data isolation
    const { deviceId } = useDeviceId();

    // Create theme-aware styles for home screen components
    const homeStyles = createHomeStyles(colors);

    // Real-time query to fetch device-specific todos from the database
    // Always call the query, deviceId might be undefined initially but that's handled by the backend
    const todos = useQuery(api.todos.getTodos, { deviceId: deviceId ?? undefined });

    // Calculate completion statistics with comprehensive null safety
    // Handle cases where todos is undefined (loading) or deviceId is not ready
    const totalTodos = todos ? todos.length : 0;
    const completedTodos = todos ? todos.filter((todo) => todo.isCompleted).length : 0;

    // Calculate completion percentage for progress bar
    // Handles edge cases: division by zero and ensures clean percentage display
    const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    // Determine motivational message based on progress
/*     const getMotivationalMessage = () => {
        if (totalTodos === 0) return "Ready to start your day!";
        if (progress === 100) return "All done! Great job! 🎉";
        if (progress >= 75) return "Almost there! Keep going! 💪";
        if (progress >= 50) return "You're halfway there! 🚀";
        if (progress >= 25) return "Good start! Keep it up! ⭐";
        return "Let's get started! 💼";
    };
 */
    return (
        // Main header container
        <View style={homeStyles.header}>
            {/* Title section with app branding and task summary */}
            <View style={homeStyles.titleContainer}>
                {/* App icon with primary gradient background */}
                <LinearGradient colors={colors.gradients.primary} style={homeStyles.iconContainer}>
                    {/* Lightning bolt icon suggests speed and productivity */}
                    <Ionicons name="flash-outline" size={28} color="#fff" />
                </LinearGradient>

                {/* Title and subtitle text container */}
                <View style={homeStyles.titleTextContainer}>
                    {/* Main app title with motivational emoji */}
                    <Text style={homeStyles.title}>Today&apos;s Tasks 👀</Text>
                    
                    {/* Dynamic subtitle showing detailed completion status */}
                    {/* Updates in real-time as todos are completed, added, or deleted */}
                    <Text style={homeStyles.subtitle}>
                        {completedTodos} of {totalTodos} completed
                    </Text>
                              
                </View>
            </View>

            {/* Progress tracking section */}
            <View style={homeStyles.progressContainer}>
                <View style={homeStyles.progressBarContainer}>
                    {/* Progress bar with dynamic fill based on completion percentage */}
                    <View style={homeStyles.progressBar}>
                        {/* Animated progress fill with success gradient */}
                        {/* Only show progress fill if there are todos to avoid empty bar */}
                        {totalTodos > 0 && (
                            <LinearGradient
                                colors={colors.gradients.success}
                                style={[
                                    homeStyles.progressFill, 
                                    { width: `${progress}%` } // Dynamic width based on completion percentage
                                ]}
                            />
                        )}
                    </View>
                    
                    {/* Percentage text display with conditional formatting */}
                    <Text style={homeStyles.progressText}>
                        {totalTodos > 0 ? `${Math.round(progress)}%` : '0%'}
                    </Text>
                </View>

                {/* Optional: Motivational message based on progress */}
{/*                 <Text style={homeStyles.motivationalText}>
                    {getMotivationalMessage()}
                </Text> */}
            </View>
        </View>
    )
}

export default Header