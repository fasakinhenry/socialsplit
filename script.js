const MAX_TWEET_LENGTH = 280; // Twitter character limit
let isCharacterSplit = false; // Flag to track if character split is enabled
let isNumberingActive = false; // Flag to track if tweet numbering is active

function toggleSplitType(toggleType) {
    isCharacterSplit = toggleType === 'character';
    if (!isCharacterSplit) {
        splitStory(); // Automatically split the story if toggling to sentence mode
    }
}

function splitStory() {
    const storyInput = document.getElementById('storyInput').value.trim();
    const sentences = isCharacterSplit ? splitByCharacter(storyInput) : storyInput.split(/[.!?]/);

    const tweetPartsElement = document.getElementById('tweetParts');
    tweetPartsElement.innerHTML = '';

    let totalTweets = 0;
    let currentTweet = '';
    sentences.forEach((sentence, index) => {
        const trimmedSentence = sentence.trim();
        const punctuation = /[.!?]$/.test(trimmedSentence) ? trimmedSentence.slice(-1) : ''; // Check if last character is punctuation
        const newTweet = `${currentTweet}${trimmedSentence}${punctuation} `;
        if (newTweet.length <= MAX_TWEET_LENGTH) {
            currentTweet = newTweet;
        } else {
            addTweetPart(tweetPartsElement, currentTweet, ++totalTweets);
            currentTweet = `${trimmedSentence}${punctuation} `;
        }
    });

    // Add the last tweet part
    if (currentTweet.trim() !== '') {
        addTweetPart(tweetPartsElement, currentTweet, ++totalTweets);
    }

    if (isNumberingActive) {
        addTweetNumbers(); // Update tweet numbers if numbering is active
    }
}

function addTweetPart(container, tweetContent, tweetNumber) {
    const tweetPart = document.createElement('div');
    tweetPart.classList.add('tweet');

    const tweetNumberText = isNumberingActive ? `(${tweetNumber}/${container.children.length + 1})` : ''; // Include tweet number if numbering is active
    const tweetContentWithNumber = `${tweetContent} ${tweetNumberText}`;

    tweetPart.innerText = tweetContentWithNumber.trim();

    const copyButton = document.createElement('button');
    copyButton.classList.add('copy');
    copyButton.innerText = `Copy`; 
    copyButton.addEventListener('click', () => {
        const tweetToCopy = `${tweetContentWithNumber}`; // Include tweet number when copying
        navigator.clipboard.writeText(tweetToCopy);
        let toastText = `Copied successfully`
        toast(toastText);
    });

    // Show number of characters in the tweet
    const characterCount = tweetContent.length;
    const charCountElement = document.createElement('span');
    charCountElement.classList.add('char-count');
    charCountElement.textContent = `${characterCount} characters`;
    tweetPart.appendChild(charCountElement);

    tweetPart.appendChild(copyButton);
    container.appendChild(tweetPart);
}

function addTweetNumbers() {
    const tweetParts = document.querySelectorAll('.tweet');
    tweetParts.forEach((tweet, index) => {
        const tweetNumberText = `(${index + 1}/${tweetParts.length})`; // Tweet number format: (current/total)
        const existingNumberingElement = tweet.querySelector('.tweet-numbering');
        if (isNumberingActive) {
            if (!existingNumberingElement) {
                const numberingElement = document.createElement('span');
                numberingElement.classList.add('tweet-numbering');
                numberingElement.textContent = tweetNumberText;
                tweet.appendChild(numberingElement);
            }
        } else {
            if (existingNumberingElement) {
                existingNumberingElement.remove();
            }
        }
    });

    // Toggle the "active" class for styling
    const numberTweetButton = document.querySelector('.numberTweet');
    numberTweetButton.classList.toggle('active', isNumberingActive);
}

function splitByCharacter(input) {
    const chunkSize = MAX_TWEET_LENGTH - 3; // Adjust for tweet number and space
    const chunks = [];
    let index = 0;
    while (index < input.length) {
        chunks.push(input.slice(index, index + chunkSize));
        index += chunkSize;
    }
    return chunks;
}

function toast(message, type = 'success', timer = '1500', position = 'top') {
    const Toast = swal.mixin({
        toast: true,
        iconColor: "#287bff",
        timer: timer,
        timerProgressBar: true,
        position: position,
        showConfirmButton: false,
        timer: timer
    })

    Toast.fire({
        icon: type,
        title: message
    });
}
