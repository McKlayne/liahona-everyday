import { Source } from './types';

/**
 * Content Service for fetching related study materials
 *
 * Note: The Church of Jesus Christ doesn't provide a public API.
 * This service provides:
 * 1. Deep links to Gospel Library
 * 2. Search links to churchofjesuschrist.org
 * 3. Placeholder for future API integrations (Open Scripture API, etc.)
 */

export interface SearchResult {
  title: string;
  url: string;
  type: 'scripture' | 'conference' | 'manual';
  summary?: string;
}

/**
 * Generate suggested search terms based on topic description
 */
export function generateSearchTerms(description: string): string[] {
  // Extract key words from description (simple approach)
  const words = description.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4);

  return words.slice(0, 5);
}

/**
 * Create search URLs for Church resources
 */
export function createSearchUrls(searchTerm: string): SearchResult[] {
  const encodedTerm = encodeURIComponent(searchTerm);

  return [
    {
      title: `Search Book of Mormon for "${searchTerm}"`,
      url: `https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng&query=${encodedTerm}`,
      type: 'scripture',
    },
    {
      title: `Search General Conference for "${searchTerm}"`,
      url: `https://www.churchofjesuschrist.org/study/general-conference?lang=eng#keyword=${encodedTerm}`,
      type: 'conference',
    },
    {
      title: `Search All Gospel Library for "${searchTerm}"`,
      url: `https://www.churchofjesuschrist.org/search?lang=eng&query=${encodedTerm}&facet=scriptures`,
      type: 'scripture',
    },
  ];
}

/**
 * Generate suggested sources for a topic
 * This provides helpful starting points for study
 */
export function generateSuggestedSources(
  title: string,
  description: string
): Source[] {
  const searchTerms = generateSearchTerms(description);
  const primaryTerm = title || searchTerms[0] || 'faith';

  const sources: Source[] = [];

  // Add Book of Mormon search
  sources.push({
    id: `bofm-${Date.now()}`,
    type: 'scripture',
    title: 'Search Book of Mormon',
    url: `https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng&query=${encodeURIComponent(primaryTerm)}`,
  });

  // Add General Conference search
  sources.push({
    id: `conf-${Date.now()}`,
    type: 'conference',
    title: 'Search General Conference Talks',
    url: `https://www.churchofjesuschrist.org/study/general-conference?lang=eng#keyword=${encodeURIComponent(primaryTerm)}`,
  });

  // Add Gospel Library search
  sources.push({
    id: `search-${Date.now()}`,
    type: 'scripture',
    title: 'Search All Gospel Resources',
    url: `https://www.churchofjesuschrist.org/search?lang=eng&query=${encodeURIComponent(primaryTerm)}`,
  });

  return sources;
}

/**
 * Match topic keywords to popular topics
 */
function matchTopicKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const matches: string[] = [];

  const topicKeywords = Object.keys(popularTopics);

  for (const keyword of topicKeywords) {
    if (text.includes(keyword)) {
      matches.push(keyword);
    }
  }

  return matches;
}

/**
 * Generate suggested sources asynchronously with better recommendations
 * This searches for specific Book of Mormon chapters based on topic keywords
 * and ensures Book of Mormon sources are always first
 */
export async function generateSuggestedSourcesAsync(
  title: string,
  description: string
): Promise<Source[]> {
  // Simulate processing time for the loading animation (1.5-2.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const sources: Source[] = [];
  const searchTerms = generateSearchTerms(description);
  const primaryTerm = title || searchTerms[0] || 'faith';

  // Match keywords to popular topics
  const matchedKeywords = matchTopicKeywords(title, description);

  // Add specific Book of Mormon chapters if we found matches
  if (matchedKeywords.length > 0) {
    const primaryKeyword = matchedKeywords[0] as keyof typeof popularTopics;
    const topicSources = popularTopics[primaryKeyword];

    if (topicSources && topicSources.length > 0) {
      // Add the most relevant BOM chapter
      sources.push({
        id: `bofm-specific-${Date.now()}-1`,
        type: 'scripture',
        title: topicSources[0].title,
        url: topicSources[0].url,
      });

      // Add the second BOM chapter if available
      if (topicSources.length > 1) {
        sources.push({
          id: `bofm-specific-${Date.now()}-2`,
          type: 'scripture',
          title: topicSources[1].title,
          url: topicSources[1].url,
        });
      }
    }
  }

  // Always add a general Book of Mormon search
  sources.push({
    id: `bofm-search-${Date.now()}`,
    type: 'scripture',
    title: `Search Book of Mormon for "${primaryTerm}"`,
    url: `https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng&query=${encodeURIComponent(primaryTerm)}`,
  });

  // Add General Conference search
  sources.push({
    id: `conf-${Date.now()}`,
    type: 'conference',
    title: `General Conference on "${primaryTerm}"`,
    url: `https://www.churchofjesuschrist.org/study/general-conference?lang=eng#keyword=${encodeURIComponent(primaryTerm)}`,
  });

  // Add Gospel Library search
  sources.push({
    id: `search-${Date.now()}`,
    type: 'scripture',
    title: 'Search All Gospel Resources',
    url: `https://www.churchofjesuschrist.org/search?lang=eng&query=${encodeURIComponent(primaryTerm)}&facet=scriptures`,
  });

  return sources;
}

/**
 * Popular Book of Mormon topics for suggestions
 */
export const popularTopics = {
  faith: [
    {
      title: 'Alma 32 - Faith as a Seed',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32?lang=eng',
    },
    {
      title: 'Ether 12 - Faith, Hope, and Charity',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/12?lang=eng',
    },
  ],
  prayer: [
    {
      title: 'Enos 1 - Mighty Prayer',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/enos/1?lang=eng',
    },
    {
      title: '3 Nephi 18 - Instructions on Prayer',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/18?lang=eng',
    },
  ],
  repentance: [
    {
      title: 'Alma 36 - Alma\'s Conversion',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/36?lang=eng',
    },
    {
      title: 'Mosiah 4 - King Benjamin on Repentance',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/4?lang=eng',
    },
  ],
  family: [
    {
      title: '1 Nephi 8 - Lehi\'s Dream and Family',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/8?lang=eng',
    },
    {
      title: 'Mosiah 4 - Caring for Family',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/4?lang=eng',
    },
  ],
  love: [
    {
      title: 'Moroni 7 - Charity, the Pure Love of Christ',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/7?lang=eng',
    },
    {
      title: '2 Nephi 26 - God\'s Love for All',
      url: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/26?lang=eng',
    },
  ],
};

/**
 * Create a deep link to Gospel Library app
 * These links will open in the Gospel Library mobile app if installed
 */
export function createGospelLibraryDeepLink(webUrl: string): string {
  return webUrl.replace('https://www.churchofjesuschrist.org/study', 'gospellibrary://content');
}
