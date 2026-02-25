/**
 * Appends a new row to BUGS.md via the GitHub Contents API.
 * Owner reports go to "### My Reports", user reports go to "### Needs Triage".
 *
 * Requires env vars:
 *   GITHUB_TOKEN  — fine-grained PAT with "Contents: Read and write" on castilloraymond/dutch-exams
 */

const REPO_OWNER = "castilloraymond";
const REPO_NAME = "dutch-exams";
const FILE_PATH = "docs/BUGS.md";
const BRANCH = "main";
const TRIAGE_HEADER = "### Needs Triage (reported via bug widget)";
const OWNER_REPORTS_HEADER = "### My Reports (owner-reported via bug widget)";

function todayISO(): string {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

/** Returns the next bug number by scanning existing rows in the file. */
function nextBugNumber(content: string): number {
    const matches = content.match(/^\|\s*(\d+)\s*\|/gm) ?? [];
    const nums = matches.map((m) => parseInt(m.replace(/\D/g, ""), 10)).filter(Boolean);
    return nums.length > 0 ? Math.max(...nums) + 1 : 13;
}

interface OwnerContext {
    isOwnerReport: boolean;
    scrollPosition?: string;
    activeSection?: string;
    screenshotUrl?: string;
}

/** Builds the new markdown table row. */
function buildRow(
    num: number,
    description: string,
    pageUrl: string,
    email: string | null,
    ownerContext?: OwnerContext
): string {
    const location = pageUrl ? pageUrl.replace(/^https?:\/\/[^/]+/, "") || "/" : "Unknown";

    let notes: string;
    if (ownerContext?.isOwnerReport) {
        const parts = ["[me]"];
        if (ownerContext.scrollPosition) parts.push(`Scroll: ${ownerContext.scrollPosition}`);
        if (ownerContext.activeSection) parts.push(`Section: "${ownerContext.activeSection}"`);
        if (ownerContext.screenshotUrl) parts.push(`[Screenshot](${ownerContext.screenshotUrl})`);
        notes = parts.join(" · ");
    } else {
        notes = email ? `Reporter: ${email}` : "";
    }

    const status = ownerContext?.isOwnerReport ? "Open" : "Needs Triage";
    return `| ${num} | ${description.slice(0, 120).replace(/\|/g, "\\|")} | \`${location}\` | ${todayISO()} | ${status} | ${notes} |`;
}

export async function appendBugToTracker(
    description: string,
    pageUrl: string,
    email: string | null,
    ownerContext?: OwnerContext
): Promise<void> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.warn("GITHUB_TOKEN not set — skipping BUGS.md update");
        return;
    }

    const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    };

    // 1. Fetch current file
    const getRes = await fetch(`${apiBase}?ref=${BRANCH}`, { headers });
    if (!getRes.ok) {
        console.error("GitHub API GET failed:", getRes.status, await getRes.text());
        return;
    }
    const { content: encoded, sha } = await getRes.json() as { content: string; sha: string };
    const current = Buffer.from(encoded, "base64").toString("utf-8");

    // 2. Pick the target section header
    const targetHeader = ownerContext?.isOwnerReport ? OWNER_REPORTS_HEADER : TRIAGE_HEADER;
    const headerIndex = current.indexOf(targetHeader);
    if (headerIndex === -1) {
        console.error(`Could not find "${targetHeader}" section in BUGS.md`);
        return;
    }

    // Find the end of the table header/separator lines after the section heading
    // Structure: heading \n\n | # | ... | \n |---|...| \n  <-- insert here
    const afterHeader = current.indexOf("\n", headerIndex + targetHeader.length);
    const separatorEnd = current.indexOf("\n", current.indexOf("\n|---|", afterHeader) + 1);

    const newRow = buildRow(nextBugNumber(current), description, pageUrl, email, ownerContext);
    const updated = current.slice(0, separatorEnd + 1) + newRow + "\n" + current.slice(separatorEnd + 1);

    // 3. Commit updated file
    const commitMessage = ownerContext?.isOwnerReport
        ? `bug: add owner-reported issue (${todayISO()})`
        : `bug: add user-reported issue from widget (${todayISO()})`;

    const putRes = await fetch(apiBase, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            message: commitMessage,
            content: Buffer.from(updated).toString("base64"),
            sha,
            branch: BRANCH,
        }),
    });

    if (!putRes.ok) {
        console.error("GitHub API PUT failed:", putRes.status, await putRes.text());
    }
}
