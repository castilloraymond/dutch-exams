/**
 * Creates a GitHub Issue for each bug report from the FeedbackWidget.
 *
 * Requires env vars:
 *   GITHUB_TOKEN  — fine-grained PAT with "Issues: Read and write" on castilloraymond/dutch-exams
 */

const REPO_OWNER = "castilloraymond";
const REPO_NAME = "dutch-exams";

interface OwnerContext {
    isOwnerReport: boolean;
    scrollPosition?: string;
    activeSection?: string;
    screenshotUrl?: string;
}

/** Truncate to ~80 chars on a word boundary. */
function truncateTitle(description: string): string {
    const clean = description.replace(/\s+/g, " ").trim();
    if (clean.length <= 80) return clean;
    const cut = clean.slice(0, 80);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "…";
}

function todayISO(): string {
    return new Date().toISOString().split("T")[0];
}

function buildIssueBody(
    description: string,
    pageUrl: string,
    email: string | null,
    ownerContext?: OwnerContext
): string {
    const lines: string[] = [];

    lines.push("## Bug Report");
    lines.push("");
    lines.push(description);
    lines.push("");

    if (pageUrl) {
        lines.push(`**Page:** ${pageUrl}`);
    }
    if (email) {
        lines.push(`**Reporter:** ${email}`);
    }
    lines.push(`**Date:** ${todayISO()}`);

    if (ownerContext?.isOwnerReport) {
        lines.push("");
        lines.push("### Owner Context");
        if (ownerContext.scrollPosition) {
            lines.push(`- Scroll position: ${ownerContext.scrollPosition}`);
        }
        if (ownerContext.activeSection) {
            lines.push(`- Active section: "${ownerContext.activeSection}"`);
        }
        if (ownerContext.screenshotUrl) {
            lines.push(`- Screenshot: ${ownerContext.screenshotUrl}`);
        }
    }

    lines.push("");
    lines.push("---");
    lines.push("*Reported via bug widget*");

    return lines.join("\n");
}

export async function createBugIssue(
    description: string,
    pageUrl: string,
    email: string | null,
    ownerContext?: OwnerContext
): Promise<void> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.warn("GITHUB_TOKEN not set — skipping GitHub Issue creation");
        return;
    }

    const labels = ["bug"];
    if (ownerContext?.isOwnerReport) {
        labels.push("owner-reported");
    } else {
        labels.push("needs-triage");
    }

    const title = truncateTitle(description);
    const body = buildIssueBody(description, pageUrl, email, ownerContext);

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
        console.error("GitHub Issues API failed:", res.status, await res.text());
    }
}
