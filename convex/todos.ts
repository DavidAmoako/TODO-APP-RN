// Import Convex utilities for database operations and input validation
import { ConvexError, v } from 'convex/values';
// Import Convex server functions to define database operations
import { mutation, query } from './_generated/server';

/**
 * Query: Get Device-Specific Todos
 * Retrieves only the todos belonging to the specific device
 * Provides complete data isolation between devices/users
 */
export const getTodos = query({
    // Requires device ID to identify which todos to retrieve
    args: { deviceId: v.string() },
    handler: async (ctx, args) => {
        // Query only the todos that belong to this specific device
        const todos = await ctx.db
            .query('todos')
            .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
            .order("desc")
            .collect();
        
        return todos;
    },
});

/**
 * Mutation: Add New Device-Specific Todo
 * Creates a new todo item linked to the specific device
 */
export const addTodo = mutation({
    // Input validation: requires todo text and device ID
    args: { 
        text: v.string(),
        deviceId: v.string()
    },
    handler: async (ctx, args) => {
        // Insert new todo linked to the device
        const todoId = await ctx.db.insert('todos', { 
            text: args.text,           // User-provided todo text
            isCompleted: false,        // Default to incomplete status
            deviceId: args.deviceId    // Link to specific device
        });
        
        return todoId;
    },
});

/**
 * Mutation: Toggle Device's Todo Completion Status
 * Only allows modification of todos belonging to the same device
 */
export const toggleTodo = mutation({
    args: { 
        id: v.id('todos'),
        deviceId: v.string()
    },
    handler: async (ctx, args) => {
        // Get the todo and verify it belongs to the current device
        const todo = await ctx.db.get(args.id);
        
        if (!todo) {
            throw new ConvexError('Todo not found');
        }

        // Verify the todo belongs to the current device
        if (todo.deviceId !== args.deviceId) {
            throw new ConvexError('Not authorized to modify this todo');
        }
        
        // Update the todo's completion status
        await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
    },
});

/**
 * Mutation: Delete Device's Todo
 * Only allows deletion of todos belonging to the same device
 */
export const deleteTodo = mutation({
    args: { 
        id: v.id('todos'),
        deviceId: v.string()
    },
    handler: async (ctx, args) => {
        // Get the todo and verify it belongs to the current device
        const todo = await ctx.db.get(args.id);
        
        if (!todo) {
            throw new ConvexError('Todo not found');
        }

        // Verify the todo belongs to the current device
        if (todo.deviceId !== args.deviceId) {
            throw new ConvexError('Not authorized to delete this todo');
        }

        // Delete the todo
        await ctx.db.delete(args.id);
    },
});

/**
 * Mutation: Update Device's Todo Text
 * Only allows updating todos belonging to the same device
 */
export const updateTodo = mutation({
    args: { 
        id: v.id('todos'), 
        text: v.string(),
        deviceId: v.string()
    },
    handler: async (ctx, args) => {
        // Get the todo and verify it belongs to the current device
        const todo = await ctx.db.get(args.id);
        
        if (!todo) {
            throw new ConvexError('Todo not found');
        }

        // Verify the todo belongs to the current device
        if (todo.deviceId !== args.deviceId) {
            throw new ConvexError('Not authorized to update this todo');
        }

        // Update the todo text
        await ctx.db.patch(args.id, { text: args.text });
    },
});

/**
 * Mutation: Clear All Device's Todos (Device-Specific Danger Zone)
 * Only deletes todos belonging to the current device
 */
export const clearAllTodos = mutation({
    args: { deviceId: v.string() },
    handler: async (ctx, args) => {
        // Get only the todos belonging to this device
        const deviceTodos = await ctx.db
            .query('todos')
            .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
            .collect();
        
        // Delete each todo belonging to the device
        for (const todo of deviceTodos) {
            await ctx.db.delete(todo._id);
        }
        
        // Return count of deleted items for user feedback
        return { deletedCount: deviceTodos.length };
    },
});


