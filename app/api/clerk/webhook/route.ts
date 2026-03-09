import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createLoopsContact, sendLoopsEvent } from "@/lib/loops";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const email = evt.data.email_addresses[0]?.email_address;
      const firstName = evt.data.first_name || "";

      if (email) {
        // Create Loops contact and fire signup event
        await createLoopsContact({
          email,
          properties: {
            firstName,
            signupDate: new Date().toISOString(),
            quickAssessmentCompleted: false,
            exercisesCompleted: 0,
          },
        });
        await sendLoopsEvent({ email, eventName: "user_signed_up" });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
