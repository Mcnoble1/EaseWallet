import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getReview = query({
    args: { userId: v.any() },
    handler: async (ctx, args) => {
        const review = await ctx.db.query("reviews")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .collect();
        return review;
        },
    });

export const getPfiReviews = query({
    args: { pfi: v.any() },
    handler: async (ctx, args) => {
        const reviews = await ctx.db.query("reviews")
        .filter((q) => q.eq(q.field("pfi"), args.pfi))
        .collect();
        return reviews;
        },
    });

export const getReviews = query({
    args: {},
    handler: async (ctx) => {
        const reviews = await ctx.db.query("reviews").collect();
        return reviews;
        },
    });

export const createReview = mutation({
    args: { userId: v.any(), rating: v.any(), review: v.string(), pfi: v.string(), name: v.string(), transactionId: v.any() },
    handler: async (ctx, args) => {
        const { userId, rating, review, pfi, name, transactionId  } = args;
        const reviewId = await ctx.db.insert("reviews", {
            userId,
            rating,
            review,
            pfi,
            name,
            transactionId,
        });
        return reviewId;
    },
});

export const deleteReview = mutation({
    args: { id: v.id("reviews") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const aggregateReviews = query({
    args: {},
    handler: async (ctx) => {
        const reviews = await ctx.db.query("reviews").collect();
        const total = reviews.length;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;
        return { total, average };
    },
});


