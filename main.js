async function fetchWordList() {
    try {
        let response = await fetch('sowpods.txt');
        let data = (await response.text()).split('\n');
        return data;
    } catch (error) {
        console.error('Error fetching the random word:', error);
    }
}

fetchWordList().then(wordList => {
    wordArray = wordList;
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    recentWord = currentWord;
    document.getElementById('currentWord').innerHTML = currentWord;
    while (findWordsPossible(wordArray, [], dissectWord(currentWord), currentWord).length < possibilityLimit) {
        currentWord = wordList[Math.floor(Math.random() * wordList.length)];
        recentWord = currentWord;
        document.getElementById('currentWord').innerHTML = currentWord;
    }
});

let possibilityLimit = 300;
let score = 0;
let words = 0;
let joinersList = [];
let wordsList = [];
let currentWordFormatting = '';
let textBox;
let scoreBox;
let currentWordBox;
let numWordsBox;
let wordsScoreRatioBox;
let errorBox;

document.addEventListener('DOMContentLoaded', function() {
    textBox = document.getElementById('textBox');
    scoreBox = document.getElementById('scoreBox');
    currentWordBox = document.getElementById('currentWord');
    numWordsBox = document.getElementById('numWords');
    wordsScoreRatioBox = document.getElementById('wordsScoreRatio');
    errorBox = document.getElementById('errorBox');
    textBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const textBoxValue = textBox.value;
            for (let i = 2; i < textBoxValue.length; i++) {
                if (currentWord.substring(currentWord.length - i) == textBoxValue.substring(0, i) && !joinersList.includes(textBoxValue.substring(0, i)) && wordArray.includes(textBoxValue) && !textBoxValue.includes(recentWord) && !wordsList.includes(textBoxValue)) {
                    currentWordFormatting = currentWord.substring(0, currentWord.length - i) + '<span style="color: red;">' + textBoxValue.substring(0, i) + '</span>' + textBoxValue.substring(i);
                    currentWord += textBoxValue.substring(i);
                    joinersList.push(textBoxValue.substring(0, i));
                    wordsList.push(textBoxValue);
                    recentWord = textBoxValue;
                    score += i;
                    words++;
                    currentWordBox.innerHTML = currentWordFormatting;
                    numWordsBox.innerHTML = words;
                    wordsScoreRatioBox.innerHTML = score + "/" + words + " ≈ " + (score / words).toFixed(2);
                    scoreBox.innerHTML = score;
                    textBox.value = '';
                    errorBox.innerHTML = '';
                    if (findWordsPossible(wordArray, joinersList, dissectWord(recentWord), recentWord).length == 0) {
                        giveUp();
                    }
                    break;
                } else if (joinersList.includes(textBoxValue.substring(0, i))) {
                    errorBox.innerHTML = "error: " + textBoxValue + "'s joiner has been used before.";
                } else if (!wordArray.includes(textBoxValue)) {
                    errorBox.innerHTML = "error: " + textBoxValue + " is not a word.";
                } else if (textBoxValue.includes(recentWord)) {
                    errorBox.innerHTML = "error: " + textBoxValue + " contains the recent word.";
                } else if (wordsList.includes(textBoxValue)) {
                    errorBox.innerHTML = "error: " + textBoxValue + " has been used before.";}
            }
        }
    });
});

function resetGame() {
    score = 0;
    words = 0;
    joinersList = [];
    wordsList = [];
    currentWordFormatting = '';
    currentWordBox.innerHTML = '';
    numWordsBox.innerHTML = '';
    wordsScoreRatioBox.innerHTML = '';
    scoreBox.innerHTML = '';
    textBox.value = '';
    errorBox.innerHTML = '';
    currentWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    recentWord = currentWord;
    document.getElementById('currentWord').innerHTML = currentWord;
    while (findWordsPossible(wordArray, [], dissectWord(currentWord), currentWord).length < possibilityLimit) {
        currentWord = wordArray[Math.floor(Math.random() * wordArray.length)];
        recentWord = currentWord;
        document.getElementById('currentWord').innerHTML = currentWord;
    }
}

function findWordsPossible(words, usedJoiners, unusedJoiners, recentWord) {
    return words.filter(word => {
        const startsWithUnusedJoiner = unusedJoiners.some(prefix => word.startsWith(prefix));
        const startsWithUsedJoiner = usedJoiners.some(prefix => word.startsWith(prefix));
        const isContainedByRecentWord = recentWord.includes(word);
        
        return !startsWithUsedJoiner && startsWithUnusedJoiner && !isContainedByRecentWord;
    });
}

function dissectWord(word) {
    const prefixes = [];
    for (let i = 2; i < word.length; i++) {
        prefixes.push(word.substring(word.length - i));
    }
    return prefixes;
}

let possibleWords = [];

function giveUp() {
    document.getElementById('closingBox').style.display = 'block';

    document.getElementById('finalScore').innerHTML = score;
    document.getElementById('finalNumWords').innerHTML = words;
    document.getElementById('finalWordsScoreRatio').innerHTML = (score / words).toFixed(2);

    possibleWords = findWordsPossible(wordArray, joinersList, dissectWord(recentWord), recentWord);
    document.getElementById('possibleWords').innerHTML = possibleWords.slice(0, 15).join(', ');
    if (possibleWords.length > 15) {
        document.getElementById('possibleWords').innerHTML += '<a onclick="loadAll()"> and ' + (possibleWords.length - 15) + ' more.</a>';
    } else if (possibleWords.length > 0) {
        document.getElementById('possibleWords').innerHTML += '.';
    } else {
        document.getElementById('possibleWords').innerHTML = 'none.';
    }
}

function loadAll() {
    document.getElementById('possibleWords').innerHTML = possibleWords.join(', ');
}

function copyStats() {
    navigator.clipboard.writeText(`portmanteaubergine\nhttps://harperawl.github.io/portmanteaubergine/\n${currentWord}\nscore: ${score}\nnumber of words: ${words}\nwords/score ratio: ${(score / words).toFixed(2)}`);
}

function closeClosingBox() {
    document.getElementById('closingBox').style.display = 'none';
    resetGame();
}