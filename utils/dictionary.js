export function buildWordValueMap(dictionary) {
    const histogram = buildHistogram(dictionary)
    const letterValues = getLetterValues(histogram)
    return dictionary.reduce((map, word) => {
        map[word] = scoreWord(word, letterValues, dictionary.length < 20 && dictionary.length > 3) // experiment threshold to value repeat letters 
        return map
    }, {})
}

export function buildHistogram(dictionary) {
    const histogram = {}
    dictionary.forEach(word => {
        for (let letter of word) {
            const current = histogram[letter]
            histogram[letter] = current ? current + 1 : 1
        }
    })

    return histogram
}

export function getLetterValues(histogram) {
    return Object.keys(histogram).sort((a,b)=>histogram[a]-histogram[b]).reduce((acc,el,idx) =>  {acc[el] = idx+1;return acc}, {})
}

export function scoreWord(word, letterValues, valueRepeats) {
    let score = 0
    const seen = new Set()
    for (let letter of word) {
        const value = letterValues[letter]
        score += (seen.has(letter) && !valueRepeats) ? 0 : value
        seen.add(letter)
    }
    
    return score
}

export function orderByWordScore(dictionary) {
    const values = buildWordValueMap(dictionary)
    return dictionary.sort((a,b) => values[b] - values[a])
}