import all from "../words/all.js"
const masterList = new Set([...all])

export default class Wordle {
    constructor({ word, dictionary } = {}) {
        this.dictionary = dictionary
        this.initialize(word)
    }

    initialize(word) {
        const wordCount = this.dictionary.length
        const randomIdx = Math.floor(Math.random() * wordCount)

        this.targetWord = word || this.dictionary[randomIdx]
        this.wordMap = this.getWordMap(this.targetWord)
        this.guessedWords = new Set()
        this.guesses = 0
        this.maxGuesses = 6
        this.finished = false
        this.won = false
    }

    playWord(word) {
        word = word.trim().toLowerCase()
        if (!masterList.has(word)) throw new Error('Invalid word')
        if (word.length !== this.targetWord.length) throw new Error('')
        if (this.guesses >= this.maxGuesses) throw new Error('No more guesses remaining')
        if (this.guessedWords.has(word)) throw new Error('Cannot guess the same word twice')
        this.guessedWords.add(word)
        this.guesses++

        if (this.guesses === this.maxGuesses && word !== this.targetWord)
            this.endGame(false)
        if (word === this.targetWord)
            this.endGame(true)

        return this.getScore(word)
    }

    getScore = word => {
        word = word.trim().toLowerCase()
        const score = []
        const correctCounts = {}
        for (let i = 0; i < word.length; i++) {
            const letter = word[i]
            correctCounts[letter] = correctCounts[letter] || 0
            const list = this.wordMap[letter]
            if (!list || correctCounts[letter] === list.length) {
                score.push(0)
            } else if (list.includes(i)) {
                score.push(2)
                correctCounts[letter]++
            } else if (list && list.some(idx=>word[idx]!==letter) && correctCounts[letter] < list.length) {
                score.push(1)
            } else {
                score.push(0)
            }
        }

        return score
    }

    getWordMap(word) {
        const map = {}
        for (let i = 0; i < word.length; i++) {
            if (map[word[i]]) map[word[i]].push(i)
            else map[word[i]] = [i]
        }
        return map
    }

    endGame(won) {
        this.finished = true;
        this.won = won
    }

    reset(word) {
        this.initialize(word)
    }

    clone(dictionary) {
        const { word, guessedWords, guesses, maxGuesses, finished, won } = this
        const game = new Wordle({ word, dictionary })
    }
}