import Player from 'core/Player'

import common from 'words/common'

import $ from 'jquery'

document.addEventListener('DOMContentLoaded', init)
const player = new Player({ dictionary:common })
window.player = player
let history, future
let allowScoring = false
const letters = [null,null,null,null,null]

function init() {
    $(document).on('paste', () => paste())
    $('#paste').on('click', () => paste())
    $('#done').on('click', () => calculate())
    $('#reset').on('click', () => reset())
    history = $('#history')
    future = $('#future')
    loopLetters(initLetter)
    letters[0].trigger('focus')
}

function initLetter(letterInput, i) {
    letters[i] = letterInput
    const prevInput = i > 0 && $(`#i-${i-1}`)
    const nextInput = i < 4 && $(`#i-${i+1}`)
    letterInput.on('click', () => {
        if (!allowScoring) return;
        toggleScore(letterInput)
    })
    letterInput.on('keydown', (event) => {
        event.preventDefault()
        if (allowScoring) return
        if (event.key === 'Backspace') {
            if (!letterInput.val()) {
                if (prevInput) {
                    prevInput.val('')
                    prevInput.trigger('focus')
                }
            }
            letterInput.val('')
            i < 4 && prevInput && prevInput.trigger('focus')
        } else if (isLetter(event.key)) {
            letterInput.val(event.key.toUpperCase())
            nextInput && nextInput.trigger('focus')
        }

        setAllowScoring(isWordComplete())
    })
}

function resetLetter(letterInput) {
    letterInput.val('')
    letterInput.removeClass('score')
    ;[0,1,2].forEach(i => letterInput.removeClass(`score-${i}`))
}

function calculate() {
    const { word, score } = getParams()
    player.makeGuess(word)
    player.processScore(score)
    player.updateWordList()
    future.text(player.wordList.join(','))
    updateHistory(word, score)
    loopLetters(resetLetter)
    setAllowScoring(false)
    letters[0].trigger('focus')
}

function getParams() {
    const word = letters.map(l=>l.val()).join('').toLowerCase()
    const score = letters.map(getScore)
    return { word, score }
}

function updateHistory(newWord, score) {
    const container = $('<div>', { class: 'wordle' })
    for (let i = 0; i < newWord.length; i++) {
        const letter = newWord[i]
        const value = score[i]
        container.append($('<input>', { readonly: true, class: 'letter score score-'+value, value: letter.toUpperCase(), maxlength: 1}))
    }
    history.append(container)
}

function reset() {
    player.reset()
    history.text('')
    future.text('')
    loopLetters(resetLetter)
    letters[0].trigger('focus')
    setAllowScoring(false)
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
}

function fillWord(word) {
    loopLetters((letter, i) => {
        letter.val(word[i].toUpperCase())
    })
    setAllowScoring(true)
}

function setAllowScoring(flag) {
    allowScoring = flag
    window.allowScoring = allowScoring
    if (allowScoring) {
        loopLetters(letter => {
            letter.addClass('score')
            letter.addClass('score-0')
        })
    }
}