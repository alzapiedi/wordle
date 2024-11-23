import { byWordScore } from '../utils/sort.js'
import { topWordsByScore } from '../utils/stats.js'

export default class Player {
    constructor({ dictionary, game, firstWord }) {
        this.dictionary = dictionary.sort(byWordScore)
        this.game = game
        this.initialize(firstWord)
    }

    initialize(firstWord) {
        const ns = () => new Set()
        this.wordList = this.dictionary
        this.firstWord = firstWord
        this.guessed = ns()
        this.includes = ns()
        this.excludes = ns()
        this.excludesByIndex = [1,1,1,1,1].map(ns)
        this.knowns = [null, null, null, null, null]
    }

    makeGuess() {
        this.wordList = this.getMatches()
        const word = this.chooseWord()
        const score = this.game.playWord(word)
        this.guessed.add(word)
        score.forEach((value, idx) => {
            if (value === 2) {
                this.knowns[idx] = word[idx]
                this.includes.delete(word[idx])
            }
            if (value === 1)
                this.includes.add(word[idx])
                this.excludesByIndex[idx].add(word[idx])

            if (value === 0)
                this.excludes.add(word[idx])
        })
    }

    getMatches() {
        if (this.guessed.size === 0) return this.wordList
        return this.wordList.filter(this.doesWordMatch)
    }

    doesWordMatch = word => {
        const seen = new Set()
        if (this.guessed.has(word)) return false
        for (let i = 0; i < word.length; i++) {
            const known = this.isIndexKnown(i)
            if (known && word[i] !== this.knowns[i])
                return false
            if (!known && (this.excludes.has(word[i]) || this.excludesByIndex[i].has(word[i])))
                return false


            seen.add(word[i])
        }
        return [...this.includes].every(i => seen.has(i))

    }

    isIndexKnown(i) {
        return this.knowns[i] !== null
    }

    chooseWord() {
        if (this.guessed.size === 0) return this.chooseFirstWord()
        return this.wordList[0]
    }

    chooseFirstWord() {
        if (this.firstWord) return this.firstWord
        const random = Math.floor(Math.random() * topWordsByScore.length)
        return topWordsByScore[random]
    }

    reset() {
        this.initialize()
    }
}