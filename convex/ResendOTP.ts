import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { alphabet, generateRandomString } from "oslo/crypto";
 
export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    console.log("Sending email to", email);
    console.log(resend);
    const { error } = await resend.emails.send({
      from: "Easewallet <festus@easewallet.xyz>",
      to: [email],
      subject: `Verify your Easewallet account`,
      text: "Your verification code is " + token,
    });                                                                             
 
    if (error) {
      throw new Error("Could not send");
    }
  },
});
