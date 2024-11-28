import Player from 'core/Player'

import common from 'words/common'

import $ from 'jquery'

document.addEventListener('DOMContentLoaded', init)
const player = new Player({ dictionary:common })
window.player = player

let history, future
const letters = [null,null,null,null,null]
let words = []
let scores = []
window.gameData = { words, scores }

function init() {
    $(document).on('paste', () => paste())
    $('#paste').on('click', () => paste())
    $('#remove').on('click', () => removeHistory())
    $('#reset').on('click', () => reset())
    history = $('#history')
    future = $('#future')
    loopLetters(initLetter)
    
    initInputHandlers()
}

function initInputHandlers() {
    $(document).on('keydown', (event) => {
        if (event.ctrlKey) return
        event.preventDefault()
        if (event.key === 'Backspace') return backspace()
        if (isLetter(event.key)) return input(event.key)
    })
}


function initLetter(letterInput, i) {
    letters[i] = letterInput
}

function input(letter) {
    const letterInput = letters[currentLetter()]
    letterInput.val(letter.toUpperCase())

    if (isWordComplete()) submit()
}

function resetLetter(letterInput) {
    letterInput.val('')
    letterInput.removeClass(['score', 'score-0', 'score-1','score-2'])
    letterInput.off('click')
}

function currentLetter() {
    const idx = letters.findIndex(l => !l.val() || !l.val().length)
    return idx < 0 ? 4 : idx;
}

function submit() {
    const { word, score } = getParams()
    updateHistory(word, score)
    loopLetters(resetLetter)
    updateGuesses()
}

function getParams() {
    const word = getWord()
    const score = letters.map(getScore)
    return { word, score }
}

function getWord() {
    return letters.map(l=>l.val()).join('').toLowerCase()
}

function updateHistory(newWord, score) {
    const container = $('<div>', { class: 'wordle' })
    for (let i = 0; i < newWord.length; i++) {
        const letter = newWord[i]
        const value = score[i]
        const letterInput = $('<input>', { readonly: true, class: 'letter score score-'+value, value: letter.toUpperCase(), maxlength: 1})
        $(letterInput).on('click', () => handleScoreChange(letterInput, newWord, i))
        container.append(letterInput)
    }
    history.append(container)
    words.push(newWord)
    scores.push(score)
}

function removeHistory() {
    words.pop()
    scores.pop()
    history.children().last().remove()
    updateGuesses()
}

function handleScoreChange(letterInput, newWord, i) {
    const newScore = toggleScore(letterInput)
    const row = words.findIndex(w => w === newWord)
    scores[row][i] = newScore
    updateGuesses()
}

function reset() {
    player.reset()
    history.text('')
    future.text('')
    loopLetters(resetLetter)
    words = []
    scores = []
}

function paste() {
    navigator.clipboard.readText().then(word => {
        if (!word || word.length !== 5) return
        fillWord(word)
    })
}

function isWordComplete() {
    let result = true
    loopLetters((input) => {
        if (!input.val()) result = false
    })
    return result
}

function loopLetters(fn) {
    for (let i = 0; i < 5; i++) {
        const letterInput = $(`#i-${i}`)
        fn(letterInput, i)
    }
}

function isLetter(char) {
    return /[a-zA-z]/.test(char) && char.length === 1
}

function getScore(input) {
    if (input.hasClass('score-2')) return 2
    if (input.hasClass('score-1')) return 1
    if (input.hasClass('score-0')) return 0
    return 0
}

function getNextScore(input) {
    const score = getScore(input)
    if (score === 2) return 0
    return score + 1
}

function changeScore(input, newScore) {
    const score = getScore(input)
    input.removeClass(`score-${score}`)
    input.addClass(`score-${newScore}`)
}

function toggleScore(input) {
    const score = getNextScore(input)
    changeScore(input, score)
    return score
}

function fillWord(word) {
    loopLetters((letter, i) => {
        letter.val(word[i].toUpperCase())
    })
    submit()
}

function backspace() {
    const c = currentLetter()
    const prevInput = c > 0 && $(`#i-${c-1}`)
    const letterInput = letters[c]
    if (!letterInput.val()) {
        if (prevInput) {
            prevInput.val('')
        }
    }
    letterInput.val('')
}

function updateGuesses() {
    player.reset()
    for (const i in words) {
        player.makeGuess(words[i])
        player.processScore(scores[i])
    }
    const wordList = player.updateWordList()
    const choice = player.getGuess()

    if (wordList.length > 0 && words.length > 0) future.html(`<strong>${choice}</strong> `+wordList.filter(w=>w!==choice).join(','))
    else future.text('')
}