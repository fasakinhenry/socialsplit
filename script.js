const MAX_TWEET_LENGTH = 280; // Twitter character limit
let splitProgress = 0; // Tracks the progress of split

function splitStory() {
  const storyInput = document.getElementById('storyInput').value.trim();
  const sentences = storyInput.split(/[.!?]/);

  const tweetPartsElement = document.getElementById('tweetParts');
  tweetPartsElement.innerHTML = '';

  let currentTweet = '';
  if (storyInput === "") {
    Swal.fire({
        icon: "error",
        title: "Empty story field",
        confirmButtonColor: "#000",
        timer: 7000,
        showCloseButton: true,
        timerProgressBar: true,
        text: "To be able to split the story, you must at least start writing a story, init?",
        footer: '<a href="#">Try filling the Story field</a>'
    });  
  }
  splitProgress = 0; // Reset split progress
  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    const nextChar = storyInput.charAt(currentTweet.length + trimmedSentence.length);
    const punctuation = /[.!?]/.test(nextChar) ? nextChar : ''; // Check if next character is punctuation
    const newTweet = `${currentTweet}${trimmedSentence}${punctuation}`;
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

function addTweetPart(container, tweetContent) {
  const tweetPart = document.createElement('div');
  tweetPart.classList.add('tweet');
  tweetPart.innerText = tweetContent.trim();

  const copyButton = document.createElement('button');
  copyButton.classList.add('copy');
  copyButton.innerText = `Copy ${++splitProgress}`; // Increment split progress
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(tweetContent);
    let toastText = `Copied successfully`
    toast(toastText);
  });

  tweetPart.appendChild(copyButton);
  container.appendChild(tweetPart);
}
