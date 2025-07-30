// Import necessary components and utilities for the TODO app
import { createHomeStyles } from "@/assets/styles/home.styles";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TodoInput from "@/components/TodoInput";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Type definition for a Todo item based on the Convex database schema
type Todo = Doc<"todos">;

export default function Index() {
  // Get the current theme colors for consistent styling across the app
  const {colors} = useTheme();

  // State management for inline editing functionality
  const [editingId, setEditingId] = useState<Id<"todos"> | null>(null); // Track which todo is being edited
  const [editText, setEditText] = useState(""); // Store the temporary edit text

  // Create styles based on current theme colors
  const homeStyles = createHomeStyles(colors);

  // Convex database operations - these provide real-time data synchronization
  const todos = useQuery(api.todos.getTodos); // Fetch all todos from the database
  const toggleTodo = useMutation(api.todos.toggleTodo); // Toggle completion status of a todo
  const deleteTodo = useMutation(api.todos.deleteTodo); // Delete a todo from the database
  const updateTodo = useMutation(api.todos.updateTodo); // Update todo text

  // Check if data is still loading from the database
  const isLoading = todos === undefined;

  // Show loading spinner while data is being fetched
  if(isLoading) return <LoadingSpinner/>

  /**
   * Toggle the completion status of a todo item
   * Includes error handling to provide user feedback if operation fails
   */
  const handleToggleTodo = async(id: Id<"todos">) => {
    try {
      await toggleTodo({id});
    } catch (error) {
      console.log("Error toggling todo:", error);
      Alert.alert("Error", "Failed to update todo. Please try again.");
    }
  };

  /**
   * Delete a todo item with confirmation dialog
   * Shows an alert to prevent accidental deletions
   */
  const handleDeleteTodo = async(id: Id<"todos">) => {
      Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
        { text: "Cancel", style: "cancel"},
        { text: "Delete", style: "destructive", onPress: () => deleteTodo({id}),},
      ]);
  };

  /**
   * Initialize inline editing mode for a todo item
   * Sets the editing state and populates the edit text field
   */
  const handleEditTodo = (todo: Todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  /**
   * Save the edited todo text to the database
   * Includes validation and error handling
   */
  const handleSaveEdit = async() => {
    if(editingId) {
      try {
        await updateTodo({id: editingId, text: editText.trim()});
        setEditingId(null); // Exit editing mode
        setEditText(""); // Clear edit text
      } catch (error) {
        console.log("Error updating todo:", error);
        Alert.alert("Error", "Failed to update todo. Please try again.");
      }
    }
  };

  /**
   * Cancel editing mode without saving changes
   * Resets the editing state
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  /**
   * Render function for individual todo items in the FlatList
   * Handles both display and edit modes with conditional rendering
   */
  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isEditing = editingId === item._id;

    return (
      <View style={homeStyles.todoItemWrapper}>
        {/* Gradient background for modern visual appeal */}
        <LinearGradient 
        colors={colors.gradients.surface} 
        style={homeStyles.todoItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        >
          {/* Custom checkbox with completion status indicator */}
          <TouchableOpacity 
          style={homeStyles.checkbox} 
          activeOpacity={0.7}
          onPress={() => handleToggleTodo(item._id)}
          >
            <LinearGradient 
            colors={item.isCompleted ? colors.gradients.success : colors.gradients.muted}
            style={[
              homeStyles.checkboxInner,
              {borderColor: item.isCompleted ? "transparent" : colors.border},
            ]}
            >
              {/* Show checkmark icon when todo is completed */}
              {item.isCompleted && <Ionicons name="checkmark" size={18} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          {/* Conditional rendering: Edit mode vs Display mode */}
          {isEditing  ? (
            // Edit mode: Shows text input and save/cancel buttons
            <View style={homeStyles.editContainer}>
              <TextInput
                value={editText}
                onChangeText={setEditText}
                onSubmitEditing={handleSaveEdit} // Save on keyboard submit
                style={homeStyles.editInput}
                placeholder="Edit todo..."
                autoFocus // Automatically focus when entering edit mode
                multiline // Allow multiple lines for longer todos
                placeholderTextColor={colors.textMuted}
              />
              <View style={homeStyles.editButtons}>
                {/* Save button with success gradient */}
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.success} style={homeStyles.editButton}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Save</Text> 
                  </LinearGradient>
                </TouchableOpacity>

                {/* Cancel button with muted gradient */}
                <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.muted} style={homeStyles.editButton}>
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Display mode: Shows todo text and action buttons
            <View style = {homeStyles.todoTextContainer}>
              {/* Todo text with strikethrough effect for completed items */}
              <Text
                style={[
                  homeStyles.todoText,
                  item.isCompleted && {
                    textDecorationLine: "line-through",
                    color: colors.textMuted,
                    opacity: 0.6,
                  },
                ]}
              >
                {item.text}
              </Text>

              {/* Action buttons: Edit and Delete */}
              <View style={homeStyles.todoActions}>
                {/* Edit button with warning gradient */}
                <TouchableOpacity onPress={() => handleEditTodo(item)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.warning} style={homeStyles.actionButton}>
                    <Ionicons name="pencil" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
                {/* Delete button with danger gradient */}
                <TouchableOpacity onPress={() => handleDeleteTodo(item._id)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.danger} style={homeStyles.actionButton}>
                    <Ionicons name="trash" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </LinearGradient>
      </View>
    );
  };

  // Main component render - App layout structure
  return (
    // Full-screen gradient background
    <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
      {/* Status bar styling based on current theme */}
      <StatusBar barStyle={colors.statusBarStyle} />
      
      {/* Safe area wrapper to handle device-specific spacing (notches, etc.) */}
      <SafeAreaView style={homeStyles.safeArea}>
        {/* App header component */}
        <Header />
        
        {/* Input component for adding new todos */}
        <TodoInput />
        
        {/* List of todos with efficient rendering via FlatList */}
        <FlatList
          data={todos} // Todo items array from Convex database
          keyExtractor={(item) => item._id} // Unique key for each item
          renderItem={renderTodoItem} // Render function for each todo
          style={homeStyles.todoList}
          contentContainerStyle={homeStyles.todoListContent}
          ListEmptyComponent={<EmptyState />} // Show when no todos exist
          //showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
        />

      </SafeAreaView>
    </LinearGradient>
  );
}
