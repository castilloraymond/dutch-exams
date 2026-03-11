import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    const supabase = createServerSupabaseClient();
    if (supabase) {
      // Delete all user data from Supabase
      await supabase.from("exam_results").delete().eq("user_id", userId);
      if (email) {
        await supabase.from("user_progress").delete().eq("email", email);
        await supabase.from("subscribers").delete().eq("email", email);
        await supabase.from("beta_feedback").delete().eq("email", email);
      }
    }

    // Delete Clerk account last (invalidates the session)
    await client.users.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
