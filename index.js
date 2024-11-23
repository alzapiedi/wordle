import Wordle from 'core/Game'
import Player from 'core/Player'

import common from 'words/common'
import dictionary from 'words/dictionary'

import $ from 'jquery'

document.addEventListener('DOMContentLoaded', init)
const player = new Player({ dictionary, sort: true })
let history, word, score, future;

function init() {
    $('#done').on('click', () => calculate())
    $('#reset').on('click', () => reset())
    $('#choose').on('click', () => chooseWord())
    history = $('#history')
    word = $('#wordle')
    score = $('#score')
    future = $('#future')
}

function calculate() {
    const { word, score } = getParams()
    player.forceGuess(word)
    player.processScore(score)
    player.updateWordList()

    updateText(word)
}

function getParams() {
    const word = $('#wordle').val().toLowerCase()
    const score = $('#score').val().split('').map(str => parseInt(str))
    return { word, score }
}

function updateText(newWord) {
    const current = history.text()
    history.text(current + '  ' + newWord)
    future.text(player.wordList.join(','))
    word.val('')
    score.val('')
    word.focus()
}

function reset() {
    player.reset()
    history.text('')
    future.text('')
    word.focus()
}

function chooseWord() {
    const guess = player.chooseWord()
    word.val(guess)
}

