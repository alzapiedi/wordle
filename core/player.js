import Wordle from './Game.js'
import { byWordScore } from '../utils/sort.js'
import { topWordsByScore } from '../utils/stats.js'

const ns = (from) => new Set(from)

export default class Player {
    constructor({ dictionary, firstWord, sort } = {}) {
        this.dictionary = sort ? dictionary.sort(byWordScore) : dictionary
        this.initialize(firstWord)
    }

    initialize(firstWord) {
        this.wordList = this.dictionary
        this.firstWord = firstWord
        this.guessed = ns()
        this.includes = ns()
        this.excludes = ns()
        this.excludesByIndex = [1,1,1,1,1].map(() => new Set())
        this.knowns = [null, null, null, null, null]
        this.guess = null
    }

    getGuess() {
        if (this.guessed.size === 0) return this.forceGuess('salet')
        if (this.guessed.size === 1) return this.forceGuess('brond')
            
        this.wordList = this.getMatches()
        const word = this.chooseWord()
        
        this.guessed.add(word)
        this.guess = word
        return word
    }

    forceGuess(word) {
        this.guessed.add(word)
        this.guess = word
        return word
    }

    processScore = score => {
        score.forEach((value, idx) => {
            const letter = this.guess[idx]
            if (value === 2) {
                this.knowns[idx] = letter
                this.includes.delete(letter)
            }
            if (value === 1)
                this.includes.add(letter)
                this.excludesByIndex[idx].add(letter)

            if (value === 0 && !this.includes.has(letter))
                this.excludes.add(letter)
        })
    }

    updateWordList() {
        const matches = this.getMatches()
        this.wordList = matches
        return matches
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


    // get score of word guessing at otherWord
    // clone the includes/excludes temporarily
    // process the score into the new sets.
    // re-calculate wordList using updated rules
    chooseWord() {
        if (this.guessed.size === 0) return this.chooseFirstWord()

        if (this.wordList.length > 300) return this.wordList[0]
        
        let min = +Infinity
        let bestWord
        const map = {}
        for (const word of this.wordList) {
            // word is the pick being simulated against all other remaining words
            map[word] = 0
            for (const otherWord of this.wordList) {
                if (word === otherWord) continue
                const game = new Wordle({ word: otherWord, dictionary: this.wordList })
                const player = this.clone()
                const score = game.playWord(word)
                player.forceGuess(word)
                player.processScore(score)
                const matches = player.getMatches()
                map[word] += matches.length
            }
            if (map[word] < (this.wordList.length / 2)) return word
            if (map[word] < min) {
                min = map[word]
                bestWord = word
            }
        }
    
        return bestWord || this.wordList[0]
    }

    chooseFirstWord() {
        if (this.firstWord) return this.firstWord
        const random = Math.floor(Math.random() * topWordsByScore.length)
        return topWordsByScore[random]
    }

    reset() {
        this.initialize()
    }

    clone() {
        const { firstWord, wordList, guessed, includes, excludes, excludesByIndex, knowns } = this
        const player = new Player({ dictionary: wordList, firstWord })
        player.guessed = ns(guessed)
        player.includes = ns(includes)
        player.excludes = ns(excludes)
        player.excludesByIndex = excludesByIndex.map(ns)
        player.knowns = [...knowns]

        return player
    }
}