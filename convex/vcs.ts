import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getVcJWT = query({
    args: { userId: v.optional(v.any())},
    handler: async (ctx, args) => {
        const vc = await ctx.db.query("vcs")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .collect();
        return vc;
        },
    });

export const createVcJWT = mutation({
    args: { userId: v.optional(v.any()), vcJWT: v.string() },
    handler: async (ctx, args) => {
        const { userId, vcJWT } = args;
        const vcId = await ctx.db.insert("vcs", {
            userId,
            vcJWT,
        });
        return vcId;
    },
});

