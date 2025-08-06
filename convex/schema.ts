import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    todos: defineTable({
        text: v.string(),        
        isCompleted: v.boolean(), 
        deviceId: v.string(),   // Required field for todos
    }).index("by_device", ["deviceId"]),
});