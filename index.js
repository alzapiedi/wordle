const start =+new Date()
import dictionary from './words/dictionary.js'
import shitDictionary from './dump/shitDictionary.js'
import Wordle from './core/game.js'
import Player from './core/player.js'
import fs from 'fs'
import { lettersByPopularity, topWordsByScore } from './utils/stats.js'
import { byWordScore } from './utils/sort.js'
import common from './words/common.js'

const map = {}

const game = new Wordle({ dictionary:common })
const player = new Player({ dictionary, game })
function playFullGame() {
    player.reset()
    game.reset()
    while (!game.finished) {
        player.makeGuess()
    }

    return { won: game.won, guesses: Array.from(player.guessed), word: game.targetWord }
}

let N = 10000
let w = 0
let g = 0
const results = []
for (let i = 0; i < N; i++) {
    const result = playFullGame()
    if (result.won) {
        w++
        g+= result.guesses.length
    }
    results.push(result) 
}


console.log(`N: ${N}`)
console.log(`time: ${+new Date() - start}ms`)
console.log(`wins: ${(w*100)/N}`)
console.log(`avg guess: ${g/w}`)



//  Result from 1M random games
//  64% win, 95 minutes, 3.184891 avg 
//

//  100K using shitdictionary
//  time: 220479ms
//  wins: 36.711
//  avg guess: 2.03654