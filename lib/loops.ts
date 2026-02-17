import { LoopsClient } from "loops";

let client: LoopsClient | null = null;

function getClient(): LoopsClient | null {
  if (client) return client;

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) return null;

  client = new LoopsClient(apiKey);
  return client;
}

/**
 * Check if Loops is configured (API key is set).
 */
export function isLoopsConfigured(): boolean {
  return !!process.env.LOOPS_API_KEY;
}

/**
 * Create or update a contact in Loops and optionally fire an event.
 * Safe to call without Loops configured — logs to console in dev mode.
 */
export async function sendLoopsEvent({
  email,
  eventName,
  contactProperties,
}: {
  email: string;
  eventName: string;
  contactProperties?: Record<string, string | number | boolean>;
}): Promise<boolean> {
  const loops = getClient();

  if (!loops) {
    console.log(`[Loops dev] Event: ${eventName}`, { email, contactProperties });
    return true;
  }

  try {
    await loops.sendEvent({
      email,
      eventName,
      contactProperties,
    });
    return true;
  } catch (error) {
    console.error(`[Loops] Failed to send event "${eventName}":`, error);
    return false;
  }
}

/**
 * Create a contact in Loops (used for initial signup).
 * The contact is created with the provided properties.
 * Safe to call without Loops configured — logs to console in dev mode.
 */
export async function createLoopsContact({
  email,
  properties,
}: {
  email: string;
  properties?: Record<string, string | number | boolean>;
}): Promise<boolean> {
  const loops = getClient();

  if (!loops) {
    console.log("[Loops dev] Create contact:", { email, properties });
    return true;
  }

  try {
    await loops.createContact({ email, properties });
    return true;
  } catch (error) {
    // Contact might already exist — that's fine, update instead
    try {
      await loops.updateContact({ email, properties });
      return true;
    } catch (updateError) {
      console.error("[Loops] Failed to create/update contact:", updateError);
      return false;
    }
  }
}
