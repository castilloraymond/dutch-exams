/**
 * One-time migration: Supabase beta_feedback → GitHub Issues
 *
 * Reads all rows from the beta_feedback table and creates a GitHub Issue for each.
 *
 * Usage: npx tsx scripts/migrate-feedback-to-issues.ts
 */

import { config } from "dotenv";
import { createServerSupabaseClient } from "../lib/supabase-server";

config({ path: ".env.local" });

const REPO_OWNER = "castilloraymond";
const REPO_NAME = "dutch-exams";

interface FeedbackRow {
    id: number;
    description: string;
    page_url: string | null;
    email: string | null;
    is_owner_report: boolean;
    scroll_position: string | null;
    active_section: string | null;
    screenshot_url: string | null;
    created_at: string;
}

function truncateTitle(description: string): string {
    const clean = description.replace(/\s+/g, " ").trim();
    if (clean.length <= 70) return `[migrated] ${clean}`;
    const cut = clean.slice(0, 70);
    const lastSpace = cut.lastIndexOf(" ");
    return `[migrated] ${lastSpace > 30 ? cut.slice(0, lastSpace) : cut}…`;
}

function buildBody(row: FeedbackRow): string {
    const lines: string[] = [];

    lines.push("## Bug Report (migrated from Supabase)");
    lines.push("");
    lines.push(row.description);
    lines.push("");

    if (row.page_url) {
        lines.push(`**Page:** ${row.page_url}`);
    }
    if (row.email) {
        lines.push(`**Reporter:** ${row.email}`);
    }
    lines.push(`**Original report date:** ${row.created_at.split("T")[0]}`);

    if (row.is_owner_report) {
        lines.push("");
        lines.push("### Owner Context");
        if (row.scroll_position) {
            lines.push(`- Scroll position: ${row.scroll_position}`);
        }
        if (row.active_section) {
            lines.push(`- Active section: "${row.active_section}"`);
        }
        if (row.screenshot_url) {
            lines.push(`- Screenshot: ${row.screenshot_url}`);
        }
    }

    lines.push("");
    lines.push("---");
    lines.push("*Migrated from Supabase beta_feedback table*");

    return lines.join("\n");
}

async function createIssue(token: string, title: string, body: string, labels: string[]): Promise<number> {
    const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body, labels }),
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API ${res.status}: ${text}`);
    }

    const data = await res.json() as { number: number };
    return data.number;
}

async function main() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error("GITHUB_TOKEN not set in .env.local");
        process.exit(1);
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
        console.error("Supabase not configured — check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
        process.exit(1);
    }

    const { data: rows, error } = await supabase
        .from("beta_feedback")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Supabase query failed:", error.message);
        process.exit(1);
    }

    if (!rows || rows.length === 0) {
        console.log("No feedback rows found — nothing to migrate.");
        return;
    }

    console.log(`Found ${rows.length} feedback rows to migrate.\n`);

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as FeedbackRow;
        const title = truncateTitle(row.description);
        const body = buildBody(row);
        const labels = ["bug"];
        if (row.is_owner_report) {
            labels.push("owner-reported");
        } else {
            labels.push("needs-triage");
        }

        try {
            const issueNumber = await createIssue(token, title, body, labels);
            console.log(`Created issue ${i + 1}/${rows.length}: #${issueNumber} — ${title}`);
        } catch (err) {
            console.error(`Failed to create issue ${i + 1}/${rows.length}:`, err);
        }

        // Small delay to avoid rate limiting
        if (i < rows.length - 1) {
            await new Promise((r) => setTimeout(r, 500));
        }
    }

    console.log("\nMigration complete!");
}

main();
