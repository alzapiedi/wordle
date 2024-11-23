import { getWordScore } from './stats.js'

export const byWordScore = (word1, word2) => getWordScore(word2) - getWordScore(word1)