import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { OrderStatus } from "@tbdex/http-client";
 
const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    // other "users" fields...
  }).index("email", ["email"]),
  transactions: defineTable({
    userId: v.optional(v.any()),
    payinAmount: v.string(),
    payoutAmount: v.string(),
    payinCurrency: v.string(),
    payoutCurrency: v.string(),
    createdTime: v.string(),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.string(),
    exchangeId: v.string(),
    fee: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.string(),
    closeTime: v.optional(v.string()),
    closeReason: v.optional(v.string()),
    orderTime: v.optional(v.string()),
    orderStatus: v.optional(v.string()),
    orderStatusTime: v.optional(v.string()),
    quoteTime: v.string(),
    rfqTime: v.string(),
    platformFee: v.string(),
    pfi: v.string(),
  }).index("userId", ["userId"]),
  reviews: defineTable({
    userId: v.any(),
    pfi: v.string(),
    name: v.string(),
    transactionId: v.any(),
    rating: v.any(),
    review: v.string(),
  }).index("userId", ["userId"]),
  wallets: defineTable({
    userId: v.any(),
    amount: v.string(),
    currency: v.string(),
  }).index("userId", ["userId"]),
  cards: defineTable({
    userId: v.any(),
    cardNumber: v.string(),
    cardHolder: v.string(),
    expiryDate: v.string(),
    cvv: v.string(),
  }).index("userId", ["userId"]),
  bankAccounts: defineTable({
    userId: v.any(),
    accountNumber: v.string(),
    accountName: v.string(),
    bankName: v.string(),
    bankCode: v.string(),
  }).index("userId", ["userId"]),
  offerings: defineTable({
    offerings: v.any(),
  }),
  pfis: defineTable({
    did: v.string(),
    name: v.string(),
    description: v.string(),
    logo: v.string(),
    website: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    rating: v.number(),
    reviews: v.any(),
    transactions: v.any(),
  }).index("did", ["did"]),
  vcs: defineTable({
    userId: v.any(),
    vcJWT: v.string(),
  }).index("userId", ["userId"]),
  bearerDids: defineTable({
    userId: v.any(),
    did: v.any(),
  }).index("userId", ["userId"]),
});
 
export default schema;