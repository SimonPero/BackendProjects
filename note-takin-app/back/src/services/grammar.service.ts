// Interfaces for type safety
interface DictionarySource {
	name: string;
	url: string;
	language: 'en' | 'es';
}

interface SpellCheckResult {
	original: string;
	suggestions: string[];
	start: number;
	end: number;
}

class SpellChecker {
	// In-memory cache with simple expiration logic
	private dictionaryCache: Map<string, { dictionary: Set<string>, timestamp: number }> = new Map();
	private CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

	// Dictionary sources
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

	private async fetchDictionary(language: 'en' | 'es'): Promise<Set<string>> {
		const source = SpellChecker.SOURCES.find((s) => s.language === language);
		if (!source) throw new Error(`No dictionary source for language: ${language}`);

		try {
			const response = await fetch(source.url);
			const data: string = await response.text(); // Use .text() instead of .json()
			return new Set(
				data
					.split('\n')
					.map((word: string) => word.trim().toLowerCase())
					.filter((word: string) => word.length > 1 && /^[a-zá-ñ]+$/.test(word))
			);
		} catch (error) {
			console.error(`Dictionary fetch failed for ${language}:`, error);
			return new Set();
		}
	}

	private async getCachedDictionary(language: 'en' | 'es'): Promise<Set<string>> {
		const cacheKey = `dictionary_${language}`;
		const now = Date.now();

		// Check cache
		const cachedEntry = this.dictionaryCache.get(cacheKey);
		if (cachedEntry && (now - cachedEntry.timestamp) < this.CACHE_TTL) {
			return cachedEntry.dictionary;
		}

		// Fetch and cache dictionary
		const dictionary = await this.fetchDictionary(language);
		this.dictionaryCache.set(cacheKey, {
			dictionary,
			timestamp: now
		});

		return dictionary;
	}

	// Wagner-Fischer Levenshtein Distance Algorithm
	// Optimized for performance and memory efficiency
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

	// Works with wagnerFischerDistance
	private findSuggestions(word: string, dictionary: Set<string>, maxSuggestions: number = 3): string[] {
		const suggestions: Array<{ word: string; distance: number }> = [];
		for (const dictWord of dictionary) {
			if (Math.abs(word.length - dictWord.length) > 2) continue;

			const distance = this.wagnerFischerDistance(word, dictWord);

			if (distance <= 2) {
				suggestions.push({ word: dictWord, distance });
			}
		}

		return suggestions
			.sort((a, b) => a.distance - b.distance)
			.slice(0, maxSuggestions)
			.map((s) => s.word);
	}

	// Main function
	async checkSpelling(text: string, language: 'en' | 'es'): Promise<SpellCheckResult[]> {
		const dictionary = await this.getCachedDictionary(language);
		console.log("xd")
		const wordRegex = /\b\w+\b/g;
		const corrections: SpellCheckResult[] = [];

		let match;
		while ((match = wordRegex.exec(text)) !== null) {
			const word = match[0].toLowerCase();

			if (dictionary.has(word)) continue;

			const suggestions = this.findSuggestions(word, dictionary);

			if (suggestions.length > 0) {
				corrections.push({
					original: word,
					suggestions,
					start: match.index,
					end: match.index + word.length,
				});
			}
		}
		console.log("does it?")
		return corrections;
	}
}

export const spellChecker = new SpellChecker();