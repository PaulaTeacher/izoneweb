import { buildLlmsTxt } from '@/lib/seo';

export const dynamic = 'force-static';

/** AI-oriented site brief (ChatGPT, Claude, Gemini, Perplexity, etc.). */
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
