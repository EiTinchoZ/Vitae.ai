import type { GitHubRepo } from '@/types';
import type { LanguageCode } from '@/i18n';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'EiTinchoZ';

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    return repos.map((repo: Record<string, unknown>) => ({
      id: repo.id as number,
      name: repo.name as string,
      fullName: repo.full_name as string,
      description: repo.description as string | null,
      htmlUrl: repo.html_url as string,
      stargazersCount: repo.stargazers_count as number,
      forksCount: repo.forks_count as number,
      language: repo.language as string | null,
      topics: (repo.topics as string[]) || [],
      updatedAt: repo.updated_at as string,
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

export async function getRepoLanguages(
  repoName: string
): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    return {};
  }
}

const localeMap: Record<LanguageCode, string> = {
  es: 'es-PA',
  en: 'en-US',
  pt: 'pt-PT',
  de: 'de-DE',
  fr: 'fr-FR',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ar: 'ar',
  hi: 'hi-IN',
  ko: 'ko-KR',
};

export function formatDate(dateString: string, language: LanguageCode = 'es'): string {
  const date = new Date(dateString);
  const locale = localeMap[language] || localeMap.es;
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
