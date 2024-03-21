const MAX_TWEET_LENGTH = 280; // Twitter character limit
let splitProgress = 0; // Tracks the progress of split
let isCharacterSplit = false; // Flag to track if character split is enabled

let isNumberingActive = false; // Flag to track if tweet numbering is active

function addTweetNumbers() {
  isNumberingActive = !isNumberingActive; // Toggle the numbering status

  const tweetParts = document.querySelectorAll('.tweet');
  const totalTweets = tweetParts.length;

  tweetParts.forEach((tweet, index) => {
    const existingNumberingElement = tweet.querySelector('.tweet-numbering');
    if (isNumberingActive) {
      if (!existingNumberingElement) {
        const tweetNumberText = `(${index + 1}/${totalTweets})`; // Tweet number format: (current/total)
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

function splitStory() {
  const storyInput = document.getElementById('storyInput').value.trim();
  const sentences = isCharacterSplit ? splitByCharacter(storyInput) : storyInput.split(/[.!?]/);

  const tweetPartsElement = document.getElementById('tweetParts');
  tweetPartsElement.innerHTML = '';

  let currentTweet = '';
  splitProgress = 0; // Reset split progress
  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    const punctuation = /[.!?]$/.test(trimmedSentence) ? trimmedSentence.slice(-1) : ''; // Check if last character is punctuation
    const newTweet = `${currentTweet}${trimmedSentence}${punctuation} `;
    if (newTweet.length <= MAX_TWEET_LENGTH) {
      currentTweet = newTweet;
    } else {
      addTweetPart(tweetPartsElement, currentTweet);
      currentTweet = `${trimmedSentence}${punctuation} `;
    }
  });

  // Add the last tweet part
  if (currentTweet.trim() !== '') {
    addTweetPart(tweetPartsElement, currentTweet);
  }
}

function toggleSplitType(toggleType) {
  isCharacterSplit = toggleType === 'character';
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

function addTweetPart(container, tweetContent) {
  const tweetPart = document.createElement('div');
  tweetPart.classList.add('tweet');

  const tweetNumberText = isNumberingActive ? `(${++splitProgress}/${container.children.length + 1})` : ''; // Include tweet number if numbering is active
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
