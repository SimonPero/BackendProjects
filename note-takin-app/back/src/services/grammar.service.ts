export interface DictionarySource {
	name: string;
	url: string;
	language: 'en' | 'es';
}

export interface SpellCheckResult {
	original: string;
	suggestions: string[];
}

export class SpellChecker {
	private dictionaryCache: Map<string, { dictionary: Map<string, string>[]; timestamp: number }> = new Map();
	private CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // Cache for 30 days

	private static SOURCES: DictionarySource[] = [
		{
			name: 'English WordList',
			url: 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
			language: 'en',
		},
		{
			name: 'Spanish Dictionary',
			url: 'https://raw.githubusercontent.com/JorgeDuenasLerin/diccionario-espanol-txt/master/0_palabras_todas.txt',
			language: 'es',
		},
	];

	private async fetchDictionary(language: 'en' | 'es', signal?: AbortSignal): Promise<Map<string, string>[]> {
		const source = SpellChecker.SOURCES.find((s) => s.language === language);
		if (!source) throw new Error(`No dictionary source for language: ${language}`);

		try {
			const response = await fetch(source.url, { signal });
			const data = await response.text();

			const words = data
				.split('\n')
				.map((word) => word.trim().toLowerCase())
				.filter((word) => /^[a-zá-ñ']+$/.test(word) && word.length > 1);

			const chunkSize = 100;
			const dictionaryChunks: Map<string, string>[] = [];
			const entries: [string, string][] = words.map((word) => [word, word]);

			for (let i = 0; i < entries.length; i += chunkSize) {
				dictionaryChunks.push(new Map(entries.slice(i, i + chunkSize)));
			}

			return dictionaryChunks;
		} catch (error) {
			console.error(`Error fetching dictionary for ${language}:`, error);
			throw new Error('Failed to fetch dictionary');
		}
	}

	private async getCachedDictionary(language: 'en' | 'es'): Promise<Map<string, string>[]> {
		const cacheKey = `dictionary_${language}`;
		const now = Date.now();

		const cachedEntry = this.dictionaryCache.get(cacheKey);
		if (cachedEntry && now - cachedEntry.timestamp < this.CACHE_TTL) {
			return cachedEntry.dictionary;
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		try {
			const dictionary = await this.fetchDictionary(language, controller.signal);
			clearTimeout(timeoutId);

			this.dictionaryCache.set(cacheKey, { dictionary, timestamp: now });
			return dictionary;
		} catch (error) {
			clearTimeout(timeoutId);
			console.error(`Error loading dictionary for ${language}:`, error);
			return [];
		}
	}

	async checkSpelling(text: string, language: 'en' | 'es'): Promise<SpellCheckResult[]> {
		const dictionaryChunks = await this.getCachedDictionary(language);

		const corrections: SpellCheckResult[] = [];
		const seenCorrections = new Set<string>();
		const wordRegex = /\b[\p{L}']+\b/gu;

		const textWords = text.match(wordRegex) || [];

		for (const word of textWords) {
			const normalizedWord = word.toLowerCase().trim();
			if (normalizedWord.length <= 1) continue;

			let found = false;
			for (const chunk of dictionaryChunks) {
				if (chunk.has(normalizedWord)) {
					found = true;
					break;
				}
			}

			if (!found) {
				const suggestions = this.findSuggestionsAcrossChunks(normalizedWord, dictionaryChunks);
				if (suggestions.length > 0 && !seenCorrections.has(normalizedWord)) {
					corrections.push({ original: normalizedWord, suggestions });
					seenCorrections.add(normalizedWord);
				}
			}
		}

		return corrections;
	}

	private findSuggestionsAcrossChunks(word: string, dictionary: Map<string, string>[], maxSuggestions: number = 3): string[] {
		const suggestions: { word: string; distance: number }[] = [];
		const processedWords = new Set<string>();

		for (const chunk of dictionary) {
			for (const [dictWord] of chunk) {
				if (processedWords.has(dictWord)) continue;

				const distance = this.wagnerFischerDistance(word, dictWord);
				if (distance <= 2) {
					suggestions.push({ word: dictWord, distance });
					processedWords.add(dictWord);
				}
			}
		}

		return suggestions
			.sort((a, b) => a.distance - b.distance)
			.slice(0, maxSuggestions)
			.map((s) => s.word);
	}

	private wagnerFischerDistance(s1: string, s2: string): number {
		if (s1.length < s2.length) [s1, s2] = [s2, s1];
		const m = s1.length;
		const n = s2.length;

		if (m - n > 2) return m;

		const dp = Array.from({ length: n + 1 }, (_, i) => i);

		for (let i = 1; i <= m; i++) {
			let prev = dp[0];
			dp[0] = i;

			for (let j = 1; j <= n; j++) {
				const temp = dp[j];
				dp[j] = s1[i - 1] === s2[j - 1] ? prev : Math.min(prev, dp[j - 1], dp[j]) + 1;
				prev = temp;
			}
		}

		return dp[n];
	}
}

export const spellChecker = new SpellChecker();
