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
	private dictionaryCache: Map<string, { dictionary: Map<string, string>[]; timestamp: number }> = new Map();
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

	private async fetchDictionary(language: 'en' | 'es', signal?: AbortSignal): Promise<Map<string, string>[]> {
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

			const dictionary = new Set(words);
			const chunkSize = 10000;
			const dictionaryChunks: Map<string, string>[] = [];
			const entries: [string, string][] = Array.from(dictionary.values()).map((word) => [word, word]);
			for (let i = 0; i < entries.length; i += chunkSize) {
				dictionaryChunks.push(new Map(entries.slice(i, i + chunkSize)));
			}
			return dictionaryChunks;
		} catch (error) {
			console.error(`Dictionary fetch failed for ${language}:`, error);
			throw new Error('Dictionary fetch failed');
		}
	}

	private async getCachedDictionary(language: 'en' | 'es'): Promise<Map<string, string>[]> {
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

			if (dictionary.length > 0) {
				this.dictionaryCache.set(cacheKey, {
					dictionary,
					timestamp: now,
				});
			}

			return dictionary;
		} catch (error) {
			console.error(`Dictionary fetch failed for ${language}:`, error);
			return this.dictionaryCache.get(cacheKey)?.dictionary ?? [];
		}
	}

	private findSuggestions(word: string, dictionaryChunks: Map<string, string>[], maxSuggestions: number = 4): string[] {
		const suggestions: { word: string; distance: number }[] = [];

		for (const chunk of dictionaryChunks) {
			for (const dictWord of chunk.keys()) {
				if (Math.abs(word.length - dictWord.length) > 2) continue;

				const distance = this.wagnerFischerDistance(word, dictWord);
				if (distance <= 2) {
					suggestions.push({ word: dictWord, distance });
				}
			}
		}

		return suggestions
			.sort((a, b) => a.distance - b.distance)
			.slice(0, maxSuggestions)
			.map((item) => item.word);
	}

	async checkSpelling(text: string, language: 'en' | 'es'): Promise<SpellCheckResult[]> {
		try {
			const dictionaryChunks = await this.getCachedDictionary(language);

			const markdownRegex = /[#*_\[\]()\w]+/g;
			const corrections: SpellCheckResult[] = [];

			let match;
			while ((match = markdownRegex.exec(text)) !== null) {
				const word = match[0].toLowerCase().trim();
				let found = false;

				for (const key in dictionaryChunks) {
					if (dictionaryChunks[key] instanceof Map) {
						if (word.length <= 1) {
							break;
						}
						if (dictionaryChunks[key].has(word)) {
							found = true;
							break;
						}
					} else {
						console.error(`dictionaryChunks[${key}] is not a Map`);
					}
				}

				if (found) {
					const suggestions = this.findSuggestions(word, Object.values(dictionaryChunks));

					if (suggestions.length > 0) {
						corrections.push({
							original: word,
							suggestions,
						});
					}
				}
			}

			return corrections;
		} catch (error) {
			console.error('Spelling check failed:', error);
			return [];
		}
	}

	private wagnerFischerDistance(s1: string, s2: string): number {
		if (s1.length < s2.length) {
			return this.wagnerFischerDistance(s2, s1);
		}

		if (s2.length === 0) return s1.length;

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
}

export const spellChecker = new SpellChecker();
