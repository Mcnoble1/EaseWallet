import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveBearerDids = mutation({
    args: { userId: v.id("users"), did: v.any() },
    handler: async (ctx, args) => {
        const { userId, did } = args;
        await ctx.db.insert("bearerDids", {
            userId,
            did,
        });
    },
});

export const getBearerDids = query({
    args: {},
    handler: async (ctx) => {
        const bearerDids = await ctx.db.query("bearerDids").collect();
        return bearerDids;
    },
});