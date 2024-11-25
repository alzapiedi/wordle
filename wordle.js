import Wordle from 'core/Game'
import Player from 'core/Player'

import common from 'words/common'

import $ from 'jquery'

document.addEventListener('DOMContentLoaded', init)
const game = new Wordle({ dictionary: common })
const letters = [null,null,null,null,null]
let allowSubmit = false

function init() {
    hideResetButton()
    initInputHandlers()
    initPlaceholderRows()
    loopLetters(initLetter)
    $('#reset').on('click', () => reset())
}

function clearInputHandlers() {
    $(document).off('keydown')
    $('.key').off('click')
}

function initInputHandlers() {
    $(document).on('keydown', (event) => {
        if (event.ctrlKey) return
        event.preventDefault()
        if (event.key === 'Enter') return submit()
        if (event.key === 'Backspace') return backspace()
        if (isLetter(event.key)) return input(event.key)
    })

    $('.key').on('click', (event) => {
        if (event.target.id === 'submit') return submit()
        if (event.target.id === 'backspace') return backspace()
        if (isLetter(event.target.id)) return input(event.target.id)
    })
}

function initPlaceholderRows() {
    removePlaceholderRows()
    const row = $('.wordle').last()
    for (let i = 0; i < game.maxGuesses - game.guesses - 1; i++) {
        const newRow = row.clone()
        newRow.children().each((_, letter) => {
            $(letter).attr('id', null)
            $(letter).attr('disabled', true)
        })
        newRow.addClass('placeholder')
        newRow.insertAfter(row)
    }
}

function initLetter(letterInput, i) {
    letters[i] = letterInput
}

function input(letter) {
    if (allowSubmit) return
    const letterInput = letters[currentLetter()]
    letterInput.val(letter.toUpperCase())

    setAllowSubmit(isWordComplete())
}

function submit() {
    if (!allowSubmit) return
    const word = getWord()
    try {
        const score = game.playWord(word)
        removePlaceholderRow()
        updateHistory(word, score)
        updateKeyboard(word, score)
        loopLetters(resetLetter)
        setAllowSubmit(false)
    } catch (e) {
        flashError(e)
    }
    
    if (game.finished)
        return finishGame()
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
    setAllowSubmit(false)
}

function currentLetter() {
    const idx = letters.findIndex(l => !l.val() || !l.val().length)
    return idx < 0 ? 4 : idx;
}

function getWord() {
    return letters.map(l=>l.val() || '').join('').toLowerCase()
}

function loopLetters(fn) {
    for (let i = 0; i < 5; i++) {
        const letterInput = $(`#i-${i}`)
        fn(letterInput, i)
    }
}

function loopKeys(fn) {
    $('.key').each((i, key) => {
        fn($(key), i)
    })
}

function setAllowSubmit(flag) {
    allowSubmit = flag
}

function isLetter(char) {
    return /[a-zA-z]/.test(char) && char.length === 1
}

function isWordComplete() {
    let result = true
    loopLetters((input) => {
        if (!input.val()) result = false
    })
    return result
}

function updateHistory(newWord, score) {
    const container = $('<div>', { class: 'wordle' })
    for (let i = 0; i < newWord.length; i++) {
        const letter = newWord[i]
        const value = score[i]
        container.append($('<input>', { readonly: true, class: 'letter score score-'+value, value: letter.toUpperCase(), maxlength: 1}))
    }
    $('#history').append(container)
}

function updateKeyboard(word, score) {
    score.forEach((value, idx) => {
        const letter = word[idx]
        const key = $(`#${letter}`)
        if (key.hasClass('score-2')) return
        if (value === 2) {
            key.removeClass('score-1')
            key.addClass(['score','score-2'])
        }
        if (value === 1) {
            key.addClass(['score','score-1'])
        }
        if (value === 0) {
            key.addClass(['score','score-0'])
        }
    })
}

function disableInput(input) {
    input.attr('disabled', true)
}

function finishGame() {
    clearInputHandlers()
    unhideResetButton()
    loopLetters(disableInput)

    if (!game.won)
        $('#solution').text(game.targetWord.toUpperCase())

    if (game.guesses === 6) 
        hideLetters()
}

function reset(word) {
    setAllowSubmit(false)
    game.reset(word)
    $('#error').hide()
    $('#solution').text('')
    $('#history').text('')
    loopLetters(resetLetter)
    loopKeys(resetKey)
    hideResetButton()
    unhideLetters()
    initInputHandlers()
    initPlaceholderRows()
}

function resetLetter(letterInput) {
    letterInput.val('')
    letterInput.removeClass(['score', 'score-0', 'score-1', 'score-2'])
    letterInput.attr('disabled', false)
}

function resetKey(key) {
    key.removeClass(['score', 'score-0', 'score-1', 'score-2'])
}

function removePlaceholderRow() {
    $('.placeholder').last().remove()
}

function removePlaceholderRows() {
    while ($('.placeholder').length > 0)
        removePlaceholderRow()
}

function unhideResetButton() {
    $('.buttons').show()
}

function hideResetButton() {
    $('.buttons').hide()
}

function hideLetters() {
    loopLetters(l => l.hide())
}

function unhideLetters() {
    loopLetters(l => l.show())
}

let errTimeout
function flashError(e) {
    clearInterval(errTimeout)
    const err = $('#error')
    err.show()
    err.text(e.message)
    errTimeout = setTimeout(() => err.hide(), 3000)
}

function simulateGames({ word, speed, N, startingWords }) {
    if (!speed || (!N && N !== 0)) return
    const getTime = (speed, i) => ({ 1: 1000, 2: 800, 3: 600, 4: 400, 5: 200 }[speed]*i)
    return new Promise((resolve) => {
        if (!N) return resolve()
        reset(word)
        const player = new Player({ dictionary: common, startingWords })
        const turns = []
    
        while(!game.finished) {
            const guess = player.getGuess()
            player.makeGuess(guess)
            const score = game.playWord(guess)
            player.processScore(score)
    
            turns.push({ guess, score })
        }
    
        turns.forEach(({ guess, score }, idx) => setTimeout(() => {
            const i = idx
            removePlaceholderRow()
            updateHistory(guess,score)
            updateKeyboard(guess, score)
            loopLetters(resetLetter)
            if (i === turns.length - 1) { 
                finishGame()
                setTimeout(() => {
                    resolve()
                    simulateGames({ word, speed, N: N - 1, startingWords })
                }, 500)
            }
        }, getTime(speed, idx)))
    })
}

window.simulateGames = simulateGames