import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import TurndownService from 'turndown';
import { CANDIDATE_PROFILE } from '../profile/profile.data';

const turndown = new TurndownService();

/**
 * Fetches a job posting URL and strips it down to readable text.
 * Real-world postings (Greenhouse, LinkedIn, Lever, etc.) are full of
 * nav/footer noise — we keep this simple and let the model do the
 * heavy lifting of finding the relevant parts, rather than trying to
 * write a brittle per-site scraper.
 */
async function fetchJobPostingText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobSearchCopilot/0.1)' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  const html = await res.text();
  const markdown = turndown.turndown(html);
  // Keep it bounded — job postings rarely need more than this to extract
  // the relevant requirements, and it keeps token usage predictable.
  return markdown.slice(0, 15000);
}

export const jobAnalysisServer = createSdkMcpServer({
  name: 'job-analysis',
  version: '1.0.0',
  tools: [
    tool(
      'fetch_job_posting',
      'Fetch a job posting URL and return its content as cleaned-up text/markdown.',
      { url: z.string().url() },
      async ({ url }) => {
        try {
          const text = await fetchJobPostingText(url);
          return { content: [{ type: 'text', text }] };
        } catch (err) {
          return {
            content: [
              {
                type: 'text',
                text: `Could not fetch the URL automatically (${(err as Error).message}). Ask the user to paste the job description text directly instead.`,
              },
            ],
          };
        }
      },
    ),

    tool(
      'get_candidate_profile',
      "Return the candidate's real skills, years of experience, explicit gaps, and work preferences.",
      {},
      async () => {
        return { content: [{ type: 'text', text: JSON.stringify(CANDIDATE_PROFILE, null, 2) }] };
      },
    ),
  ],
});
