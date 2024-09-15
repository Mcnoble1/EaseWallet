import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTransaction = query({
    args: { _id: v.any() },
    handler: async (ctx, args) => {
        const transaction = await ctx.db.query("transactions")
        .filter((q) => q.eq(q.field("_id"), args._id))
        .collect();
        return transaction;
        },
    });

export const getUserTransactions = query({
    args: { userId: v.any() },
    handler: async (ctx, args) => {
        const transactions = await ctx.db.query("transactions")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .collect();
        return transactions;
        },
    });

export const getTransactions = query({
    args: {},
    handler: async (ctx) => {
        const transactions = await ctx.db.query("transactions").collect();
        return transactions;
        },
    });

export const createTransaction = mutation({
    args: { userId: v.any(), payinAmount: v.string(), payoutAmount: v.string(), closeReason: v.optional(v.string()), payinCurrency: v.string(), payoutCurrency: v.string(), type: v.optional(v.string()), description: v.optional(v.string()), status: v.string(), exchangeId: v.any(), fee: v.optional(v.string()), from: v.optional(v.string()), to: v.string(), closeTime: v.optional(v.string()), orderTime: v.optional(v.string()), quoteTime: v.string(), rfqTime: v.string(), platformFee: v.string(), pfi: v.string(), createdTime: v.string(), orderStatus: v.optional(v.string()), orderStatusTime: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const { userId, payinAmount, payoutAmount, payinCurrency, closeReason, orderStatus, orderStatusTime, payoutCurrency, type, description, status, exchangeId, fee, from, to, closeTime, orderTime, quoteTime, rfqTime, platformFee, pfi, createdTime  } = args;
        const transactionId = await ctx.db.insert("transactions", {
            userId,
            payinAmount,
            payinCurrency,
            payoutCurrency,
            type,
            description,
            status,
            exchangeId,
            fee,
            from,
            to,
            payoutAmount,
            closeTime,
            closeReason,
            orderTime,
            quoteTime,
            rfqTime,
            platformFee,
            pfi,
            createdTime,
            orderStatus,
            orderStatusTime
        });
        return transactionId;
    },
});

export const updateTransaction = mutation({
    args: { id: v.id("transactions"), userId: v.any(), payinAmount: v.string(), payoutAmount: v.string(), closeReason: v.optional(v.string()), payinCurrency: v.string(), payoutCurrency: v.string(), type: v.optional(v.string()), description: v.optional(v.string()), status: v.string(), exchangeId: v.any(), fee: v.optional(v.string()), from: v.optional(v.string()), to: v.string(), closeTime: v.optional(v.string()), orderTime: v.optional(v.string()), quoteTime: v.string(), rfqTime: v.string(), platformFee: v.string(), pfi: v.string(), createdTime: v.string(), orderStatus: v.optional(v.string()), orderStatusTime: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const { id, userId, payinAmount, payoutAmount, payinCurrency, payoutCurrency, type, closeReason, description, status, exchangeId, fee, from, to, closeTime, orderTime, quoteTime, rfqTime, platformFee, pfi, createdTime  } = args;
        await ctx.db.patch(id, {
            userId,
            payinAmount,
            payinCurrency,
            payoutCurrency,
            type,
            description,
            status,
            exchangeId,
            fee,
            closeReason,
            from,
            to,
            payoutAmount,
            closeTime,
            orderTime,
            quoteTime,
            rfqTime,
            platformFee,
            pfi,
            createdTime,
        })
    }
});

export const deleteTransaction = mutation({
    args: { id: v.id("transactions") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

