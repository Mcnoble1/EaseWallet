import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
import { ResendOTP } from "./ResendOTP";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password,
    Password({ reset: ResendOTPPasswordReset }),
    Password({ verify: ResendOTP }),
    ResendOTP,
    Password({
      id: "password-code",
      reset: ResendOTPPasswordReset,
      verify: ResendOTP,
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        await ctx.db.patch(args.existingUserId, {
          email: args.profile.email,
          name: args.profile.name, // Include the name here
        });
        return args.existingUserId;
      } else {
        return await ctx.db.insert('users', {
          email: args.profile.email,
          name: args.profile.name, // And here
        });
      }
    },
  },
});

