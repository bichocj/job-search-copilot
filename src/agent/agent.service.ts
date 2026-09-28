import { Injectable, Logger } from '@nestjs/common';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { jobAnalysisServer } from './job-analysis.mcp-server';

export interface FitAnalysisResult {
  extractedStack: string[];
  matchedSkills: string[];
  gaps: string[];
  locationFlag: string | null;
  summary: string;
}

const SYSTEM_PROMPT = `You are a career-fit analyst helping a real candidate decide whether to apply
for a job. You have two tools: fetch_job_posting (given a URL, returns the posting's text) and
get_candidate_profile (returns the candidate's real skills, years of experience, explicit gaps,
and work preferences).

Always call both tools before answering. Be honest and specific — never invent experience the
candidate does not have, and always flag location/remote requirements that might not match their
preferences.

Respond with ONLY a JSON object (no markdown fences, no prose before or after) matching exactly
this shape:
{
  "extractedStack": string[],       // technologies/skills mentioned in the posting
  "matchedSkills": string[],        // skills from the posting the candidate genuinely has
  "gaps": string[],                 // skills required that the candidate lacks or is weak in
  "locationFlag": string | null,    // e.g. "Requires on-site in Dubai" or null if remote-friendly
  "summary": string                 // 2-3 sentence honest verdict on whether to apply
}`;

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  async analyzeJobPosting(url: string): Promise<FitAnalysisResult> {
    let raw = '';

    for await (const event of query({
      prompt: `Analyze this job posting for fit: ${url}`,
      options: {
        systemPrompt: SYSTEM_PROMPT,
        mcpServers: { jobAnalysis: jobAnalysisServer },
        allowedTools: ['mcp__jobAnalysis__fetch_job_posting', 'mcp__jobAnalysis__get_candidate_profile'],
      },
    })) {
      if (event.type === 'assistant') {
        for (const block of event.message.content) {
          if (block.type === 'text') raw += block.text;
        }
      }
    }

    try {
      return JSON.parse(raw.trim());
    } catch {
      this.logger.warn(`Agent did not return valid JSON, raw output: ${raw}`);
      return {
        extractedStack: [],
        matchedSkills: [],
        gaps: [],
        locationFlag: null,
        summary: `Could not parse a structured analysis. Raw agent output: ${raw.slice(0, 500)}`,
      };
    }
  }
}
