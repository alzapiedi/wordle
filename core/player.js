import WordGraph from './graph.js'
import { buildWordValueMap, buildWordGraphValueMap } from '../utils/dictionary.js'
import letters from '../words/letters.js'

const ns = (from) => new Set(from)

const DEFAULT_STARTING_WORDS = []

export default class Player {
    constructor({ dictionary, firstWord, startingWords } = {}) {
        this.valuesMap = buildWordValueMap(dictionary)
        this.dictionary = dictionary.sort(this.byWordScore)
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
        if (this.guessed.size < this.startingWords.length && this.wordList.length > 90 && this.knownsCount() < 2) {
            return this.startingWords[this.guessed.size]
        }

        if (this.guessed.size === 0) {
            return this.getRandomTopWord()
        }

        this.wordList = this.getMatches()

        const word = (this.wordList.length > 50) ? this.chooseUnknown() : this.chooseWord()

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
                if (!score.some((value2,idx2) => value2 === 1 && this.guess[idx2] === letter)) this.includes.delete(letter)
            }
            if (value === 1)
                if (this.knowns.indexOf(letter) === -1)this.includes.add(letter)
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


            if (!known) seen.add(word[i])
        }
        return [...this.includes].every(i => seen.has(i))

    }

    isIndexKnown(i) {
        return this.knowns[i] !== null
    }

    chooseWord() {
        if (this.wordList.length === 0) return this.dictionary[Math.floor(Math.random() * this.dictionary.length)]
        if (this.wordList.length === 1) return this.wordList[0]

        const graph = new WordGraph(this.wordList)
        this.graph = graph

        this.valuesMap = buildWordGraphValueMap(graph)

        this.wordList = this.wordList.sort(this.byWordScore)
        const similars = this.wordList.filter(w => this.valuesMap[w] >= (this.valuesMap[this.wordList[0]] - 0.08*this.valuesMap[this.wordList[0]]))

        if (similars.length > 2 && this.guessed.size+this.wordList.length > 6) {
            const similarityRanking = [0,1,2,3,4].reduce((s, i) => s+=similars.every(w=>w[i]===similars[0][i])?1:0,0)
            if (similarityRanking >= 3) {
                return this.findWordSpecial(similars)
            }
        }
    
        return this.wordList[0]
    }

    chooseUnknown() {
        const unknownLetters = new Set(
            letters.filter(l => !(this.includes.has(l) || this.excludes.has(l) || this.knowns.indexOf(l) > -1))
        )

        const unknownWords = this.dictionary.filter(word => [...word].every(l=> unknownLetters.has(l)))

        unknownWords.sort(this.byWordScore)
        return unknownWords[0] || this.chooseWord()
    }

    byWordScore = (a,b) => this.valuesMap[b] - this.valuesMap[a]

    knownsCount = () => this.knowns.filter(Boolean).length

    getRandomTopWord() {
        const i = Math.floor(Math.random()*100)
        return this.wordList[i]
    }

    reset() {
        const { firstWord, startingWords } = this
        this.initialize(firstWord, startingWords)
    }

    findWordSpecial(list) {
        const uniqueIdx = [0,1,2,3,4].filter(i => !list.every(w => w[i]===list[0][i]))

        const characters = list.reduce((s, word) => {
            for (const i of uniqueIdx) {
                s.push(word[i])
            }
            return s
        }, [])
        
        return this.dictionary.sort((a,b) => {
            const getBonus = word => characters.filter(c => word.indexOf(c) > -1).length
            const getMinus = word => [...word].reduce((s, c) => s+=(this.includes.has(c) || this.excludes.has(c) || this.knowns.indexOf(c) > -1)?-1:0, 0)
            return (getBonus(b) + getMinus(b)) - (getBonus(a) + getMinus(a))
        })[0] || this.wordList[0]
    }
}