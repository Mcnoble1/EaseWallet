import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
    args: { _id: v.any() },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
        .filter((q) => q.eq(q.field("_id"), args._id))
        .collect();
        return user;
        },
    });

export const updateUser = mutation({
    args: { _id: v.id("users"), username: v.string(), email: v.string()},
    handler: async (ctx, args) => {
        const { _id, name, email } = args;
        await ctx.db.patch(_id, {
            _id,
            name,
            email,
        })
    }
});

export const deleteUser = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

