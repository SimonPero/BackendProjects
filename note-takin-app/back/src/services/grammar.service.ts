export interface DictionarySource {
	name: string;
	url: string;
	language: 'en' | 'es';
}

export interface SpellCheckResult {
	original: string;
	suggestions: string[];
}

export interface CheckNote {
	text: string;
	language: 'en' | 'es';
}

export class SpellChecker {
	private dictionaryCache: Map<string, { dictionary: Set<string>; timestamp: number }> = new Map();
	private CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

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

	private async fetchDictionary(language: 'en' | 'es', signal?: AbortSignal): Promise<Set<string>> {
		const source = SpellChecker.SOURCES.find((s) => s.language === language);
		if (!source) throw new Error(`No dictionary source for language: ${language}`);

		try {
			const response = await fetch(source.url, {
				signal,
				headers: {
					'Cache-Control': 'max-age=86400, stale-while-revalidate=604800',
				},
			});

			const data: string = await response.text();
			const words = data
				.split('\n')
				.slice(0, 50000)
				.map((word: string) => word.trim().toLowerCase())
				.filter((word: string) => word.length > 1 && /^[a-zá-ñ]+$/.test(word));

			return new Set(words);
		} catch (error) {
			console.error(`Dictionary fetch failed for ${language}:`, error);
			return new Set();
		}
	}

	private async getCachedDictionary(language: 'en' | 'es'): Promise<Set<string>> {
		const cacheKey = `dictionary_${language}`;
		const now = Date.now();

		const cachedEntry = this.dictionaryCache.get(cacheKey);
		if (cachedEntry && now - cachedEntry.timestamp < this.CACHE_TTL) {
			return cachedEntry.dictionary;
		}

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const dictionary = await this.fetchDictionary(language, controller.signal);
			clearTimeout(timeoutId);

			if (dictionary.size > 0) {
				this.dictionaryCache.set(cacheKey, {
					dictionary,
					timestamp: now,
				});
			}

			return dictionary;
		} catch (error) {
			console.error(`Dictionary fetch failed for ${language}:`, error);
			return this.dictionaryCache.get(cacheKey)?.dictionary ?? new Set();
		}
	}

	private wagnerFischerDistance(s1: string, s2: string): number {
		if (s1.length < s2.length) {
			return this.wagnerFischerDistance(s2, s1);
		}

		if (s2.length === 0) return s1.length;
		if (Math.abs(s1.length - s2.length) > 2) return Math.abs(s1.length - s2.length);

		let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
		let currentRow = new Array(s2.length + 1).fill(0);

		for (let i = 0; i < s1.length; i++) {
			currentRow[0] = i + 1;

			for (let j = 0; j < s2.length; j++) {
				const deletions = previousRow[j + 1] + 1;
				const insertions = currentRow[j] + 1;
				const substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);

				currentRow[j + 1] = Math.min(deletions, insertions, substitutions);
			}

			[previousRow, currentRow] = [currentRow, previousRow];
		}

		return previousRow[s2.length];
	}

	private findSuggestions(word: string, dictionary: Set<string>, maxSuggestions: number = 4): string[] {
		if (dictionary.size > 100000) {
			return [];
		}

		return Array.from(dictionary)
			.filter((dictWord) => Math.abs(word.length - dictWord.length) <= 2)
			.map((dictWord) => ({
				word: dictWord,
				distance: this.wagnerFischerDistance(word, dictWord),
			}))
			.filter((item) => item.distance <= 2)
			.sort((a, b) => a.distance - b.distance)
			.slice(0, maxSuggestions)
			.map((item) => item.word);
	}

	async checkSpelling(text: string, language: 'en' | 'es'): Promise<SpellCheckResult[]> {
		try {
			const dictionary = await this.getCachedDictionary(language);

			const markdownRegex = /[#*_\[\]()\w]+/g;
			const corrections: SpellCheckResult[] = [];

			let match;
			while ((match = markdownRegex.exec(text)) !== null) {
				const word = match[0].toLowerCase();

				if (dictionary.has(word)) continue;

				const suggestions = this.findSuggestions(word, dictionary);

				if (suggestions.length > 0) {
					corrections.push({
						original: word,
						suggestions,
					});
				}
			}
			return corrections;
		} catch (error) {
			console.error('Spelling check failed:', error);
			return [];
		}
	}
}

export const spellChecker = new SpellChecker();

export async function checkGrammarNote(toCheck: CheckNote): Promise<SpellCheckResult[]> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		const corrections = await spellChecker.checkSpelling(toCheck.text, toCheck.language || 'en');
		console.log(corrections);
		clearTimeout(timeoutId);
		return corrections;
	} catch (error) {
		console.error('Spelling check failed:', error);
		return [];
	}
}
