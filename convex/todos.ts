// Import Convex utilities for database operations and input validation
import { ConvexError, v } from 'convex/values';
// Import Convex server functions to define database operations
import { mutation, query } from './_generated/server';

/**
 * Query: Get Device-Specific Todos
 * Returns empty array if no deviceId provided (handles loading states)
 * Provides complete data isolation between devices
 */
export const getTodos = query({
    args: { deviceId: v.optional(v.string()) }, // Make deviceId optional for loading states
    handler: async (ctx, args) => {
        // Return empty array if no device ID provided (during app initialization)
        if (!args.deviceId) {
            return [];
        }

        // Store deviceId in variable for better type safety and readability
        const deviceId = args.deviceId;

        try {
            // Query todos that belong specifically to this device
            const todos = await ctx.db
                .query('todos')
                .withIndex("by_device", (q) => q.eq("deviceId", deviceId))
                .order("desc") // Most recent todos first
                .collect();
            
            return todos;
        } catch (error) {
            console.error('Error fetching todos for device:', deviceId, error);
            throw new ConvexError('Failed to fetch todos');
        }
    },
});

/**
 * Mutation: Add New Device-Specific Todo
 * Creates a new todo item linked to the specific device
 * Ensures device isolation from the moment of creation
 */
export const addTodo = mutation({
    args: { 
        text: v.string(),
        deviceId: v.string() // Required for creating todos
    },
    handler: async (ctx, args) => {
        // Validate input text
        if (!args.text.trim()) {
            throw new ConvexError('Todo text cannot be empty');
        }

        // Validate device ID
        if (!args.deviceId) {
            throw new ConvexError('Device ID is required');
        }

        try {
            // Insert new todo with device association
            const todoId = await ctx.db.insert('todos', { 
                text: args.text.trim(),    // Clean the text input
                isCompleted: false,        // Default to incomplete status
                deviceId: args.deviceId    // Link to specific device for isolation
            });
            
            return todoId;
        } catch (error) {
            console.error('Error adding todo for device:', args.deviceId, error);
            throw new ConvexError('Failed to add todo');
        }
    },
});

/**
 * Mutation: Toggle Device's Todo Completion Status
 * Only allows modification of todos belonging to the same device
 * Provides security through device ID verification
 */
export const toggleTodo = mutation({
    args: { 
        id: v.id('todos'),
        deviceId: v.string() // Required for authorization
    },
    handler: async (ctx, args) => {
        // Validate device ID
        if (!args.deviceId) {
            throw new ConvexError('Device ID is required for authorization');
        }

        try {
            // Get the todo and verify it exists
            const todo = await ctx.db.get(args.id);
            
            if (!todo) {
                throw new ConvexError('Todo not found');
            }

            // Critical security check: Verify the todo belongs to the requesting device
            if (todo.deviceId !== args.deviceId) {
                throw new ConvexError('Not authorized: Todo belongs to a different device');
            }
            
            // Update the todo's completion status
            await ctx.db.patch(args.id, { 
                isCompleted: !todo.isCompleted 
            });

            return { success: true, newStatus: !todo.isCompleted };
        } catch (error) {
            console.error('Error toggling todo for device:', args.deviceId, error);
            if (error instanceof ConvexError) {
                throw error; // Re-throw ConvexErrors as-is
            }
            throw new ConvexError('Failed to toggle todo');
        }
    },
});

/**
 * Mutation: Delete Device's Todo
 * Only allows deletion of todos belonging to the same device
 * Includes comprehensive authorization checks
 */
export const deleteTodo = mutation({
    args: { 
        id: v.id('todos'),
        deviceId: v.string() // Required for authorization
    },
    handler: async (ctx, args) => {
        // Validate device ID
        if (!args.deviceId) {
            throw new ConvexError('Device ID is required for authorization');
        }

        try {
            // Get the todo and verify it exists
            const todo = await ctx.db.get(args.id);
            
            if (!todo) {
                throw new ConvexError('Todo not found or already deleted');
            }

            // Critical security check: Verify the todo belongs to the requesting device
            if (todo.deviceId !== args.deviceId) {
                throw new ConvexError('Not authorized: Todo belongs to a different device');
            }

            // Delete the todo
            await ctx.db.delete(args.id);

            return { success: true, deletedTodoId: args.id };
        } catch (error) {
            console.error('Error deleting todo for device:', args.deviceId, error);
            if (error instanceof ConvexError) {
                throw error; // Re-throw ConvexErrors as-is
            }
            throw new ConvexError('Failed to delete todo');
        }
    },
});

/**
 * Mutation: Update Device's Todo Text
 * Only allows updating todos belonging to the same device
 * Validates both authorization and input data
 */
export const updateTodo = mutation({
    args: { 
        id: v.id('todos'), 
        text: v.string(),
        deviceId: v.string() // Required for authorization
    },
    handler: async (ctx, args) => {
        // Validate input text
        if (!args.text.trim()) {
            throw new ConvexError('Todo text cannot be empty');
        }

        // Validate device ID
        if (!args.deviceId) {
            throw new ConvexError('Device ID is required for authorization');
        }

        try {
            // Get the todo and verify it exists
            const todo = await ctx.db.get(args.id);
            
            if (!todo) {
                throw new ConvexError('Todo not found');
            }

            // Critical security check: Verify the todo belongs to the requesting device
            if (todo.deviceId !== args.deviceId) {
                throw new ConvexError('Not authorized: Todo belongs to a different device');
            }

            // Update the todo text
            await ctx.db.patch(args.id, { 
                text: args.text.trim() 
            });

            return { success: true, updatedText: args.text.trim() };
        } catch (error) {
            console.error('Error updating todo for device:', args.deviceId, error);
            if (error instanceof ConvexError) {
                throw error; // Re-throw ConvexErrors as-is
            }
            throw new ConvexError('Failed to update todo');
        }
    },
});

/**
 * Mutation: Clear All Device's Todos (Device-Specific Danger Zone)
 * Only deletes todos belonging to the current device
 * Provides bulk deletion with device isolation
 */
export const clearAllTodos = mutation({
    args: { deviceId: v.string() }, // Required for device identification
    handler: async (ctx, args) => {
        // Validate device ID
        if (!args.deviceId) {
            throw new ConvexError('Device ID is required');
        }

        try {
            // Get only the todos belonging to this specific device
            const deviceTodos = await ctx.db
                .query('todos')
                .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
                .collect();
            
            // Delete each todo belonging to the device
            for (const todo of deviceTodos) {
                await ctx.db.delete(todo._id);
            }
            
            // Return detailed result for user feedback
            return { 
                success: true, 
                deletedCount: deviceTodos.length,
                deviceId: args.deviceId 
            };
        } catch (error) {
            console.error('Error clearing todos for device:', args.deviceId, error);
            throw new ConvexError('Failed to clear todos');
        }
    },
});

/**
 * Query: Get Device Statistics
 * Provides summary statistics for a specific device's todos
 * Useful for dashboard and progress tracking
 */
export const getDeviceStats = query({
    args: { deviceId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        // Return default stats if no device ID provided
/*         if (!args.deviceId) {
            return {
                total: 0,
                completed: 0,
                pending: 0,
                completionRate: 0
            };
        } */

        try {
            // Get all todos for this device
            const todos = await ctx.db
                .query('todos')
                .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId as string))
                .collect();

            const total = todos.length;
            const completed = todos.filter(todo => todo.isCompleted).length;
            const pending = total - completed;
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                total,
                completed,
                pending,
                completionRate,
                deviceId: args.deviceId
            };
        } catch (error) {
            console.error('Error getting stats for device:', args.deviceId, error);
            throw new ConvexError('Failed to get device statistics');
        }
    },
});


