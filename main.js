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
});

let score = 0;
let words = 0;
let joiners = [];
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
                if (currentWord.substring(currentWord.length - i) == textBoxValue.substring(0, i) && !joiners.includes(textBoxValue.substring(0, i)) && wordArray.includes(textBoxValue) && !textBoxValue.includes(recentWord)) {
                    currentWordFormatting = currentWord.substring(0, currentWord.length - i) + '<span style="color: red;">' + textBoxValue.substring(0, i) + '</span>' + textBoxValue.substring(i);
                    currentWord += textBoxValue.substring(i);
                    joiners.push(textBoxValue.substring(0, i));
                    recentWord = textBoxValue;
                    score += i;
                    words++;
                    currentWordBox.innerHTML = currentWordFormatting;
                    numWordsBox.innerHTML = words;
                    wordsScoreRatioBox.innerHTML = score + "/" + words + " ≈ " + (score / words).toFixed(2);
                    scoreBox.innerHTML = score;
                    textBox.value = '';
                    errorBox.innerHTML = '';
                    break;
                } else if (joiners.includes(textBoxValue.substring(0, i))) {
                    errorBox.innerHTML = "error: " + textBoxValue + "'s joiner has been used before.";
                } else if (!wordArray.includes(textBoxValue)) {
                    errorBox.innerHTML = "error: " + textBoxValue + " is not a word.";
                } else if (textBoxValue.includes(recentWord)) {
                    errorBox.innerHTML = "error: " + textBoxValue + " contains the recent word.";
                }
            }
        }
    });
});

function resetGame() {
    score = 0;
    words = 0;
    joiners = [];
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
    possibleWords = findWordsPossible(wordArray, joiners, dissectWord(recentWord), recentWord);
    document.getElementById('possibleWords').innerHTML = possibleWords.slice(0, 15).join(', ') + '<a onclick="loadAll()"> and ' + (possibleWords.length - 15) + ' more.</a>';
}

function loadAll() {
    document.getElementById('possibleWords').innerHTML = possibleWords.join(', ');
}

function closeClosingBox() {
    document.getElementById('closingBox').style.display = 'none';
    resetGame();
}