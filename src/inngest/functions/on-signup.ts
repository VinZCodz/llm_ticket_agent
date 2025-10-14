import { NonRetriableError } from "inngest";
import User, { type UserDocument } from "../../models/user.ts";
import { inngest } from "../client.ts";
import { sendMail } from "../../utils/mailer.ts"

export const onUserSignup = () => inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },

    async ({ event, step, runId }) => {
        try {
            const { email } = event.data;

            const user = await step.run("get-user-email", async () => {
                const userObject = await User.findOne({ email }) as UserDocument;
                if (!userObject) {
                    throw new NonRetriableError("User doesn't exists!")
                }
                return userObject;
            })

            await step.run("send-welcome-email", async () => {
                await sendMail(
                    user.email,
                    `Welcome to ticketing AI system!`,
                    `Thanks for Signing up!\n\nWe are glad to have you!`
                );
            });

            return { success: true };

        } catch (error: unknown) {
            if (error instanceof Error)
                console.error("Errored on running step:", error.message);
            return { success: false };
        }
    }
);
