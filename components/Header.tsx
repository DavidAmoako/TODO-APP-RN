import { createHomeStyles } from '@/assets/styles/home.styles';
import { api } from '@/convex/_generated/api';
import useDeviceId from '@/hooks/useDeviceId';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
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

    return (
        <View style={homeStyles.header}>
            <View style={homeStyles.titleContainer}>
                <LinearGradient colors={colors.gradients.primary} style={homeStyles.iconContainer}>
                    <Ionicons name="flash-outline" size={28} color="#fff" />
                </LinearGradient>

                <View style={homeStyles.titleTextContainer}>
                    <Text style={homeStyles.title}>Today&apos;s Tasks 👀</Text>
                    
                    <Text style={homeStyles.subtitle}>{completedTodos} of {totalTodos} completed</Text>             
                </View>
            </View>

            <View style={homeStyles.progressContainer}>
                <View style={homeStyles.progressBarContainer}>
                    <View style={homeStyles.progressBar}>
                        {(totalTodos > 0) && (
                            <LinearGradient
                                colors={colors.gradients.success}
                                style={[homeStyles.progressFill, { width: `${progress}%` }]} 
                            />
                        )}
                    </View>
                    
                    <Text style={homeStyles.progressText}>{totalTodos > 0 ? `${Math.round(progress)}%` : '0%'}</Text>
                </View>

            </View>
        </View>
    );
};

export default Header;