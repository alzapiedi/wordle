import letters from '../words/letters.js'
import { buildWordValueMap } from '../utils/dictionary.js'

const allPairs = letters.reduce((list, letter) => {
    letters.forEach(l2 => list.push([letter,l2]))
    return list
},[])

class Node {
    constructor(letter) {
        this.letter = letter
        this.outs = []
        this.ins = []
        this.count = 0
    }

    directTo(otherNode, i, word) {
        this.outs.push({ idx: i, from: this.letter, to: otherNode.letter, word })
        otherNode.ins.push({ idx: i, from: this.letter, to: otherNode.letter, word })
        this.count++
        otherNode.count++
    }
}

class WordGraph {
    constructor(dictionary) {
        this.dictionary = dictionary
        this.wordValueMap = buildWordValueMap(dictionary)
        this.build()
    }

    build() {
        this.nodes = letters.reduce((map,l) => {
            map[l] = new Node(l)
            return map
        }, {})
        this.dictionary.forEach(this.processWord)
    }

    processWord = word => {
        for (let i = 0; i < word.length; i++) {
            const hasNext = i < word.length - 1
            const letter = word[i]
            const node = this.nodes[letter]

            if (hasNext) {
                const nextLetter = word[i+1]
                node.directTo(this.nodes[nextLetter], i, word)
            }
        }
    }

    scoreWord(word) {
        let score = 0
        for (let i = 0; i < word.length - 1; i++) {
            const letter = word[i]
            const nextLetter = word[i+1]
            const node = this.nodes[letter]
            const outs = node.outs.filter(e => e.idx === i)
            const n = outs.filter(out => out.to === nextLetter).length
            
            score += ((outs.length * (1 + (n / (outs.length+5))) * (1 + (outs.length / node.outs.length))))

        }
        score += this.nodes[word[4]].ins.filter(x => x.idx === 4).length
        return score
    }

    getMap() {
        const map = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}}
        letters.forEach(letter => {
            const node = this.nodes[letter]
            node.outs.forEach(({ idx, to }) => {
                const map2 = map[idx]
                if (!map2[letter]) map2[letter] = {}
                
                const count = map2[letter][to]
                map2[letter][to] = count ? count + 1 : 1
            })
        })

        return map
    }

    exists(from, to, idx) {
        return !!this.nodes[from].outs.find(edge => edge.to === to && edge.idx === idx)
    }

    getTopPairsByIndex() {
        const pairs = []
        const map = this.getMap()
        for (let i = 0; i < 4; i++) {
            const sortedPairs = 
                allPairs
                    .filter(([from,to]) => this.exists(from,to,i))
                    .sort(([f1,t1],[f2,t2]) => {
                        if (!(map[i][f1] && map[i][f2])) return !!map[i][f2]
                    
                        const c1 = map[i][f1][t1]
                        const c2 = map[i][f2][t2]
                        if (c1 && c2) {
                            return c2 - c1
                        } else if (!(c1 || c2)) {
                            return 0
                        } else {
                            return !!c2
                        }
                    })

            pairs.push(sortedPairs.map(([f,t]) => [f,t,map[i][f][t]]))

        }
        return pairs
    }
}

export default WordGraph