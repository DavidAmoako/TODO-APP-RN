import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

/**
 * ColorScheme Interface
 * Defines the complete color palette structure for both light and dark themes
 * Ensures type safety and consistency across all UI components
 */
export interface ColorScheme {
    // Base colors for fundamental UI elements
    bg: string;                    // Main background color
    surface: string;               // Card/container background color
    text: string;                  // Primary text color
    textMuted: string;             // Secondary/muted text color
    border: string;                // Border and divider color
    primary: string;               // Brand/primary accent color
    success: string;               // Success state color (green)
    warning: string;               // Warning state color (yellow/orange)
    danger: string;                // Error/danger state color (red)
    shadow: string;                // Shadow color for depth effects
    
    // Gradient color pairs for modern visual effects
    gradients: {
        background: [string, string];  // Main app background gradient
        surface: [string, string];     // Card/surface gradient
        primary: [string, string];     // Primary button/accent gradient
        success: [string, string];     // Success button gradient
        warning: [string, string];     // Warning button gradient
        danger: [string, string];      // Danger button gradient
        muted: [string, string];       // Muted/disabled gradient
        empty: [string, string];       // Empty state gradient
    };
    
    // Specific background colors for different input types
    backgrounds: {
        input: string;                 // Regular input field background
        editInput: string;             // Edit mode input background
    };
    
    // Status bar styling based on theme (light text on dark bg, dark text on light bg)
    statusBarStyle: "light-content" | "dark-content";
}

/**
 * Light Theme Color Scheme
 * Defines all colors for light mode with modern, accessible color palette
 * Uses Tailwind CSS inspired colors for consistency
 */
const lightColors: ColorScheme = {
    // Base colors - light theme uses dark text on light backgrounds
    bg: "#f8fafc",                 // Very light gray background
    surface: "#ffffff",            // Pure white for cards/surfaces
    text: "#1e293b",               // Dark slate for primary text
    textMuted: "#64748b",          // Medium slate for secondary text
    border: "#e2e8f0",             // Light gray for borders
    primary: "#3b82f6",            // Blue for primary actions
    success: "#10b981",            // Emerald green for success
    warning: "#f59e0b",            // Amber for warnings
    danger: "#ef4444",             // Red for errors/danger
    shadow: "#000000",             // Black for shadows
    
    // Gradient definitions for visual depth and modern appearance
    gradients: {
        background: ["#f8fafc", "#e2e8f0"],    // Subtle background gradient
        surface: ["#ffffff", "#f8fafc"],        // Card surface gradient
        primary: ["#3b82f6", "#1d4ed8"],       // Blue primary gradient
        success: ["#10b981", "#059669"],       // Green success gradient
        warning: ["#f59e0b", "#d97706"],       // Orange warning gradient
        danger: ["#ef4444", "#dc2626"],        // Red danger gradient
        muted: ["#9ca3af", "#6b7280"],         // Gray muted gradient
        empty: ["#f3f4f6", "#e5e7eb"],         // Light empty state gradient
    },
    
    // Input-specific backgrounds
    backgrounds: {
        input: "#ffffff",              // White input background
        editInput: "#ffffff",          // White edit input background
    },
    
    // Dark content on light background
    statusBarStyle: "dark-content" as const,
};

/**
 * Dark Theme Color Scheme
 * Defines all colors for dark mode with proper contrast and eye comfort
 * Uses darker backgrounds with lighter text for better night viewing
 */
const darkColors: ColorScheme = {
    // Base colors - dark theme uses light text on dark backgrounds
    bg: "#0f172a",                 // Very dark slate background
    surface: "#1e293b",            // Dark slate for cards/surfaces
    text: "#f1f5f9",               // Light slate for primary text
    textMuted: "#94a3b8",          // Medium light slate for secondary text
    border: "#334155",             // Medium slate for borders
    primary: "#60a5fa",            // Lighter blue for primary actions
    success: "#34d399",            // Lighter emerald for success
    warning: "#fbbf24",            // Lighter amber for warnings
    danger: "#f87171",             // Lighter red for errors/danger
    shadow: "#000000",             // Black for shadows
    
    // Dark theme gradients with appropriate contrast
    gradients: {
        background: ["#0f172a", "#1e293b"],    // Dark background gradient
        surface: ["#1e293b", "#334155"],        // Dark surface gradient
        primary: ["#3b82f6", "#1d4ed8"],       // Blue primary gradient (same as light)
        success: ["#10b981", "#059669"],       // Green success gradient
        warning: ["#f59e0b", "#d97706"],       // Orange warning gradient
        danger: ["#ef4444", "#dc2626"],        // Red danger gradient
        muted: ["#374151", "#4b5563"],         // Dark gray muted gradient
        empty: ["#374151", "#4b5563"],         // Dark empty state gradient
    },
    
    // Dark input backgrounds
    backgrounds: {
        input: "#1e293b",              // Dark slate input background
        editInput: "#0f172a",          // Very dark edit input background
    },
    
    // Light content on dark background
    statusBarStyle: "light-content" as const,
};

/**
 * Theme Context Type Definition
 * Defines the shape of the theme context for type safety
 */
interface ThemeContextType {
    isDarkMode: boolean;           // Current theme state
    toggleDarkMode: () => void;    // Function to switch themes
    colors: ColorScheme;           // Current color scheme object
}

/**
 * Theme Context Creation
 * Creates React context for theme management across the app
 */
const ThemeContext = createContext<undefined | ThemeContextType>(undefined);

/**
 * Theme Provider Component
 * Wraps the entire app to provide theme context to all child components
 * Handles theme persistence using AsyncStorage
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // State to track current theme mode (light/dark)
    const [isDarkMode, setIsDarkMode] = useState(false);

    /**
     * Effect Hook: Load Saved Theme Preference
     * Runs on component mount to restore user's previously selected theme
     */
    useEffect(() => {
        AsyncStorage.getItem("darkMode").then((value) => {
            if (value) setIsDarkMode(JSON.parse(value));
        });
    }, []);

    /**
     * Toggle Dark Mode Function
     * Switches between light and dark themes and persists the choice
     */
    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        // Persist theme preference to device storage
        await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
    };

    // Select appropriate color scheme based on current theme
    const colors = isDarkMode ? darkColors : lightColors;

    // Provide theme context to all child components
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * useTheme Custom Hook
 * Provides easy access to theme context from any component
 * Includes error handling to ensure proper usage within ThemeProvider
 */
const useTheme = () => {
    const context = useContext(ThemeContext);
    
    // Error handling: ensure hook is used within ThemeProvider
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    
    return context;
};

export default useTheme;