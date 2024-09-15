import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOfferings = mutation({
    args: { offerings: v.any() },
    handler: async (ctx, args) => {
        const { offerings } = args;
        await ctx.db.insert("offerings", {
            offerings,
        });
    },
});

export const getOfferings = query({
    args: {},
    handler: async (ctx) => {
        const offerings = await ctx.db.query("offerings").collect();
        return offerings;
    },
});





