import { createHomeStyles } from '@/assets/styles/home.styles';
import { api } from '@/convex/_generated/api';
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
 * Shows motivational messaging and current productivity metrics
 */
const Header = () => {
    // Get current theme colors for consistent styling across light/dark modes
    const { colors } = useTheme();

    // Create theme-aware styles for home screen components
    const homeStyles = createHomeStyles(colors);

    // Real-time query to fetch all todos from the database
    // This automatically updates when todos are added, deleted, or modified
    const todos = useQuery(api.todos.getTodos);

    // Calculate completion statistics with null safety
    const completedTodos = todos ? todos.filter((todo) => todo.isCompleted).length : 0;
    const totalTodos = todos ? todos.length : 0;

    // Calculate completion percentage for progress bar
    // Handles edge case where totalTodos is 0 to prevent division by zero
    const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

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
                    
                    {/* Dynamic subtitle showing completion status */}
                    {/* Updates in real-time as todos are completed or added */}
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
                        <LinearGradient
                            colors={colors.gradients.success}
                            style={[
                                homeStyles.progressFill, 
                                { width: `${progress}%` } // Dynamic width based on completion
                            ]}
                        />
                    </View>
                    
                    {/* Percentage text display */}
                    {/* Rounded to nearest whole number for clean display */}
                    <Text style={homeStyles.progressText}>{Math.round(progress)}%</Text>
                </View>
            </View>
        </View>
    )
}

export default Header