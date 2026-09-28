/**
 * Structured version of Javier's real profile, built from his resume.
 * This is the source of truth the agent compares job postings against —
 * keep it honest and up to date; the whole point of this tool is to avoid
 * over- or under-selling yourself.
 */
export const CANDIDATE_PROFILE = {
  name: 'Javier Gutierrez',
  title: 'AI-Augmented Full Stack Developer',
  yearsOfExperience: 15,
  location: 'Arequipa, Perú',
  englishLevel: 'B2',

  skills: {
    // years: null means "some exposure, not primary" — the agent should
    // flag these as partial matches, not full matches.
    'React': 9,
    'Next.js': 6,
    'Vue.js': 3.5,
    'Nuxt.js': 1,
    'Angular': 1.5,
    'React Native': 2.5,
    'Flutter': 2,
    'TypeScript': 7.5,
    'JavaScript': 12,
    'Node.js': 6.5,
    'Express': 5,
    'NestJS': 1.5,
    'Python': 9,
    'Django': 7.5,
    'Django REST Framework': 6.5,
    'FastAPI': 2,
    'Flask': 5,
    'GraphQL': 6.5,
    'Apollo Server': 5,
    'Apollo Client': 5,
    'REST APIs': 10,
    'PostgreSQL': 8.5,
    'MySQL': 8.5,
    'MongoDB': 4.5,
    'SQLite': 2.5,
    'AWS': 7.5,
    'GCP': 4.5,
    'Firebase': 5,
    'Docker': 6.5,
    'Kubernetes': 3.5,
    'Kafka': 2.5,
    'Redis': 3.5,
    'CI/CD': 7.5,
    'Jest': 5,
    'Java': 1,
    'Go': 1,
    'Claude (Sonnet/Opus)': 1.75,
    'GitHub Copilot': 2.5,
    'Claude Agent SDK / MCP': 0.2,
    'Terraform': 0.1, // actively learning right now
  } as Record<string, number>,

  // Explicit gaps — things NOT to claim experience in.
  noExperience: [
    'Blockchain / Web3 (Ethereum, Solana, etc.)',
    'Ruby on Rails',
    'RabbitMQ',
    'SQL Server',
    'Azure',
    'Azure DevOps',
    'BigQuery in a real production pipeline (only in a personal demo project)',
    'Elasticsearch',
    'n8n',
    'LangChain / LangGraph',
    'Codex',
    'Ariba/Salesforce or similar enterprise CRM platforms',
  ],

  highlights: [
    'Grew and led a development team from 1 to 15 people as CTO, scaling the client portfolio to 5 active projects per month.',
    'Fintech experience at Airtm (global digital payments platform) and PayPal (checkout page redesign).',
    'Daily AI-augmented workflow with Claude Sonnet/Opus for planning, coding, and debugging — cutting implementation time on select features from ~2 days to a few hours.',
    'Currently building agentic AI tooling hands-on with the Claude Agent SDK and MCP.',
  ],

  workPreferences: {
    remote: true,
    relocation: false,
    minEnglishRequirement: 'B2 or lower preferred',
  },
};
