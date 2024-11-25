import Wordle from './Game.js'
import { buildWordValueMap } from '../utils/dictionary.js'

const ns = (from) => new Set(from)

const DEFAULT_STARTING_WORDS = []

export default class Player {
    constructor({ dictionary, firstWord, startingWords } = {}) {
        const map = buildWordValueMap(dictionary)
        const byWordScore = (a,b) => map[b] - map[a]
        this.dictionary = dictionary.sort(byWordScore)
        this.initialize(firstWord, startingWords)
    }

    initialize(firstWord, startingWords) {
        this.wordList = [...this.dictionary]
        this.firstWord = firstWord
        this.startingWords = startingWords || DEFAULT_STARTING_WORDS
        this.guessed = ns()
        this.includes = ns()
        this.excludes = ns()
        this.excludesByIndex = [1,1,1,1,1].map(() => new Set())
        this.knowns = [null, null, null, null, null]
        this.guess = null
    }

    getGuess() {
        if (this.guessed.size < this.startingWords.length)
            return this.startingWords[this.guessed.size]

        this.wordList = this.getMatches()
        const word = this.chooseWord()

        return word
    }

    makeGuess(word) {
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
            if (value === 1) // NEEDS WORK!! SHOULD NOT BE ADDING LETTER BACK TO INCLUDES IN ALL CASES
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

    chooseWord() {
        if (this.guessed.size === 0) return this.getRandomTopWord()
        if (this.wordList.length > 300) return this.wordList[0]
        if (this.wordList.length === 0) return this.dictionary[Math.floor(Math.random() * this.dictionary.length)]

        const values = buildWordValueMap(this.wordList)
        const byValue = (a,b) => values[b] - values[a]
        this.wordList = this.wordList.sort(byValue)

        let min = +Infinity
        let bestWord
        const map = {}
        for (const word of this.wordList) {
            map[word] = 0
            for (const otherWord of this.wordList) {
                if (word === otherWord) continue
                const game = new Wordle({ word: otherWord, dictionary: this.wordList })
                const player = this.clone()
                const score = game.playWord(word)
                player.makeGuess(word)
                player.processScore(score)
                const matches = player.getMatches()
                map[word] += matches.length
            }
            if (map[word] < min) {
                min = map[word]
                bestWord = word
            }
        }
    
        return bestWord || this.wordList[0]
    }


    getRandomTopWord() {
        const i = Math.floor(Math.random()*100)
        return this.wordList[i]
    }

    reset() {
        const { firstWord, startingWords } = this
        this.initialize(firstWord, startingWords)
    }

    clone() {
        const { dictionary, firstWord, wordList, guessed, includes, excludes, excludesByIndex, knowns } = this
        const player = new Player({ dictionary: [], firstWord })
        player.dictionary = dictionary // this could be dangerous some day but it saves a lot of time
        player.wordList = [...wordList]
        player.guessed = ns(guessed)
        player.includes = ns(includes)
        player.excludes = ns(excludes)
        player.excludesByIndex = excludesByIndex.map(ns)
        player.knowns = [...knowns]

        return player
    }
}