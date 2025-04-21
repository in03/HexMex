// Default hex word list
const DEFAULT_WORDS = [
  "0B0E", "1CED", "1DEA", "A1DE", "ABBA", "AC1D", "ACED",
  "B0DE", "B0FF", "B1BB", "B1DE", "B1FF", "BABA",
  "BABE", "BEAD", "BEEF", "C0BB", "C0C0", "C0DE", "C1A0",
  "CAFE", "D0D0", "D0FF", "D1CE", "D1D0", "D1ED", "DADA", "DEAD",
  "DEAF", "DEC0", "DEED", "DEF1", "F00D", "F1D0", "F1FE", "FACE",
  "FADE", "FEED"
];

// Default blacklist
const DEFAULT_BLACKLIST = [
  "B00B", "B00C", "CACA"
];

let currentWordlist = [...DEFAULT_WORDS];
let currentBlacklist = [...DEFAULT_BLACKLIST];
let validLeetWords = [];

// Regular expression for validating hex words
const hexPattern = /^[A-F0-9]{4}$/;

// Modal state and functions
let currentModalCallback = null;

// Function to show a modal with custom content
function showModal(title, message, confirmText, cancelText, callback) {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const confirmBtn = document.getElementById('modalConfirmBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');

  // Set content
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmBtn.textContent = confirmText || 'Confirm';

  // Show/hide cancel button based on text
  if (cancelText) {
    cancelBtn.textContent = cancelText;
    cancelBtn.style.display = 'block';
  } else {
    cancelBtn.style.display = 'none';
  }

  // Store callback
  currentModalCallback = callback;

  // Show modal with animation
  modalBackdrop.style.display = 'flex';
  setTimeout(() => {
    modalBackdrop.classList.add('active');
  }, 10);

  // Add event listeners
  confirmBtn.onclick = function(e) {
    e.stopPropagation();
    confirmModal();
  };

  cancelBtn.onclick = function(e) {
    e.stopPropagation();
    cancelModal();
  };

  // Prevent clicks on the backdrop from closing the modal
  modalBackdrop.onclick = function(e) {
    if (e.target === modalBackdrop) {
      cancelModal();
    }
  };
}

// Function to hide the modal
function hideModal() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  modalBackdrop.classList.remove('active');

  // Wait for animation to complete before hiding
  setTimeout(() => {
    modalBackdrop.style.display = 'none';
  }, 300);

  // Reset callback
  currentModalCallback = null;
}

// Function to handle confirm button click
function confirmModal() {
  if (currentModalCallback) {
    currentModalCallback(true);
  }
  hideModal();
}

// Function to handle cancel button click
function cancelModal() {
  if (currentModalCallback) {
    currentModalCallback(false);
  }
  hideModal();
}

// Dynamic subtitles for the header
const dynamicSubtitles = [
  "Addresses that look as good as you do",
  "Intranet vanity plates",
  "Memorable IP addresses for memorable people",
  "Spicy pseudo-domains for the social elite",
  "Network identifiers with personality",
  "IPv6 addresses that sizzle like fajitas",
  "Digital real estate with Mexican flair",
  "Addresses hotter than jalapeños"
];

// Function to set a random subtitle
function setRandomSubtitle() {
  const randomIndex = Math.floor(Math.random() * dynamicSubtitles.length);
  const subtitle = document.querySelector('h2');
  if (subtitle) {
    subtitle.textContent = dynamicSubtitles[randomIndex];
  }
}

// Function to update subtitle on tab change
function updateSubtitleOnTabChange() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setRandomSubtitle();
    });
  });
}

// Initialize app
window.onload = function() {
  // Set a random subtitle on page load
  setRandomSubtitle();

  // Set up subtitle changes on tab navigation
  updateSubtitleOnTabChange();

  // Load last used blacklist from localStorage if available
  const savedBlacklist = localStorage.getItem('ipv6Blacklist');
  if (savedBlacklist) {
    currentBlacklist = JSON.parse(savedBlacklist);
  }

  // Load last used wordlist from localStorage if available
  const savedWordlist = localStorage.getItem('ipv6WordList');
  if (savedWordlist) {
    currentWordlist = JSON.parse(savedWordlist);
  } else {
    // If no saved wordlist, start with default words
    currentWordlist = [...DEFAULT_WORDS];
  }

  // Apply blacklist filter to ensure no blacklisted words are in the wordlist
  const blacklistedWordsInList = currentWordlist.filter(word => currentBlacklist.includes(word));
  if (blacklistedWordsInList.length > 0) {
    // Remove blacklisted words
    currentWordlist = filterBlacklistedWords(currentWordlist);

    // Save the filtered wordlist
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  }

  // Display the wordlist and blacklist chips
  updateWordlistDisplay();
  updateBlacklistDisplay();

  // Hide progress bar initially
  document.getElementById('uploadProgress').style.display = 'none';

  // Show initial stats
  updateStats();

  // Set up initial output area
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = '# Ready to generate some spicy IPv6 addresses! 🌶️\n<span class="blinking-cursor"></span>';
  }

  // Set up search input event listeners
  setupSearchListeners();

  // Set up leet converter
  setupLeetConverter();

  // Initialize drag and drop functionality
  initDragAndDrop();

  // Adjust container heights initially
  setTimeout(adjustContainerHeights, 100);
};

// Function to generate IPv6 addresses
function generateAddresses() {
  const numResults = parseInt(document.getElementById('numResults').value);
  const useUniqueWords = document.getElementById('uniqueWords').value === 'true';
  const caseStyle = document.getElementById('caseSelect').value;

  // Validate input
  if (isNaN(numResults) || numResults < 1 || numResults > 100) {
    alert('Please enter a valid number of addresses (1-100).');
    return;
  }

  if (currentWordlist.length === 0) {
    alert('No words available. Please add words to your wordlist first.');
    return;
  }

  // Check if we have enough words for unique generation
  if (useUniqueWords && currentWordlist.length < 8) {
    alert('Not enough words for unique generation. You need at least 8 different words.');
    return;
  }

  const output = document.getElementById('output');

  // Mexican-themed loading messages
  const loadingMessages = [
    '# Heating up the IPv6 salsa... 🌶️',
    '# Adding some spice to your network... 🔥',
    '# Preparing a fiesta of addresses... 💃',
    '# Mixing the perfect IPv6 guacamole... 🥑',
    '# Wrapping your addresses in a warm tortilla... 🌮'
  ];

  // Pick a random loading message
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  output.innerHTML = randomMessage + '\n\n';

  const addresses = [];

  for (let i = 0; i < numResults; i++) {
    const address = generateSingleAddress(useUniqueWords, caseStyle);
    addresses.push(address);

    // Add to output with copy button
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');

    const addressText = document.createElement('span');
    addressText.textContent = address;

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = function(e) {
      navigator.clipboard.writeText(address)
        .then(() => {
          // Update button text
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);

          // Trigger confetti explosion from the button position
          triggerConfetti(e.clientX, e.clientY);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    };

    resultDiv.appendChild(addressText);
    resultDiv.appendChild(copyBtn);
    output.appendChild(resultDiv);
  }

  // Update stats
  const statsElement = document.getElementById('stats');

  // Calculate the number of possible unique addresses
  const wordCount = currentWordlist.length;
  const totalPossible = Math.pow(wordCount, 8);

  // Format the number in scientific notation
  let formattedNumber;
  if (totalPossible > 1e6) {
    const exponent = Math.floor(Math.log10(totalPossible));
    const mantissa = totalPossible / Math.pow(10, exponent);
    formattedNumber = `${mantissa.toFixed(2)}×10^${exponent}`;
  } else {
    formattedNumber = totalPossible.toLocaleString();
  }

  // Calculate comparison to IPv4
  const ipv4Count = 4294967296;
  const timesMoreThanIpv4 = totalPossible / ipv4Count;

  let comparisonText = '';
  if (timesMoreThanIpv4 > 1) {
    if (timesMoreThanIpv4 > 1e6) {
      const exponent = Math.floor(Math.log10(timesMoreThanIpv4));
      const mantissa = timesMoreThanIpv4 / Math.pow(10, exponent);
      comparisonText = `That's ${mantissa.toFixed(2)}×10^${exponent} times more than IPv4!`;
    } else {
      comparisonText = `That's ${Math.round(timesMoreThanIpv4).toLocaleString()} times more than IPv4!`;
    }
  }

  // Mexican-themed completion messages
  const completionMessages = [
    `¡Olé! ${numResults} spicy IPv6 address${numResults !== 1 ? 'es' : ''} ready to serve! 🌮 From ${formattedNumber} possibilities. ${comparisonText} 🔥`,
    `¡Ay caramba! ${numResults} hot IPv6 address${numResults !== 1 ? 'es' : ''} with ${useUniqueWords ? 'unique' : 'random'} flavor! 🌶️ Just ${numResults} out of ${formattedNumber} possible combinations!`,
    `¡Arriba! ${numResults} sizzling IPv6 address${numResults !== 1 ? 'es' : ''} fresh from the digital grill! 🔥 That's just a taste of the ${formattedNumber} possible addresses!`
  ];

  // Pick a random completion message
  const randomCompletion = completionMessages[Math.floor(Math.random() * completionMessages.length)];
  statsElement.textContent = randomCompletion;
}

// Function to generate a single IPv6 address
function generateSingleAddress(useUniqueWords, caseStyle) {
  let segments = [];
  let usedWords = [];

  // Generate 8 segments
  for (let i = 0; i < 8; i++) {
    let word;

    if (useUniqueWords) {
      // Filter out already used words
      const availableWords = currentWordlist.filter(w => !usedWords.includes(w));

      if (availableWords.length === 0) {
        // If we run out of unique words, reset the used words list
        usedWords = [];
        word = getRandomWord(currentWordlist);
      } else {
        word = getRandomWord(availableWords);
      }
    } else {
      word = getRandomWord(currentWordlist);
    }

    usedWords.push(word);
    segments.push(word);
  }

  // Apply case formatting
  if (caseStyle === 'lowercase') {
    segments = segments.map(segment => segment.toLowerCase());
  }

  // Join with colons to form IPv6 address
  return segments.join(':');
}

// Function to get a random word from the wordlist
function getRandomWord(wordlist) {
  const randomIndex = Math.floor(Math.random() * wordlist.length);
  return wordlist[randomIndex];
}

// Function to clear the output
function clearOutput() {
  const output = document.getElementById('output');

  // Mexican-themed ready messages
  const readyMessages = [
    '# Kitchen is clean and ready for some spicy IPv6 addresses... 🌶️',
    '# The digital tequila is ready to pour some fresh addresses... 🥃',
    '# Ready to make your network as hot as a Mexican summer... 🔥',
    '# HexMex chef is ready to cook up some delicious addresses... 🌮'
  ];

  // Pick a random ready message
  const randomReady = readyMessages[Math.floor(Math.random() * readyMessages.length)];
  output.innerHTML = randomReady + '\n<span class="blinking-cursor"></span>';

  // Clear stats in both tabs
  const statsElement = document.getElementById('stats');
  if (statsElement) {
    statsElement.textContent = '';
  }

  const wordlistStatsElement = document.getElementById('wordlistStats');
  if (wordlistStatsElement) {
    wordlistStatsElement.textContent = '';
  }
}

// Current leet word being converted
let currentLeetWord = null;

// Function to set up leet converter
function setupLeetConverter() {
  const leetInput = document.getElementById('leetInput');
  const checkboxes = document.querySelectorAll('#leetSubOptions input[type="checkbox"]');

  // Add event listener for input changes
  leetInput.addEventListener('input', function() {
    convertLeetRealtime();
  });

  // Add event listeners for checkbox changes
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      convertLeetRealtime();
    });
  });

  // Initial setup
  document.getElementById('addLeetWordBtn').disabled = true;
}

// Function to convert word in real-time
function convertLeetRealtime() {
  const inputText = document.getElementById('leetInput').value.trim();
  const originalWordSpan = document.getElementById('originalWord');
  const convertedWordSpan = document.getElementById('convertedWord');
  const validationDiv = document.getElementById('leetValidation');
  const addButton = document.getElementById('addLeetWordBtn');

  // Reset current leet word
  currentLeetWord = null;
  addButton.disabled = true;

  // Clear displays if no input
  if (!inputText) {
    originalWordSpan.textContent = '-';
    convertedWordSpan.textContent = '-';
    validationDiv.textContent = 'Enter a word to convert';
    validationDiv.className = 'leet-validation';
    return;
  }

  // Get selected substitutions
  const substitutions = [];
  const checkboxes = document.querySelectorAll('#leetSubOptions input:checked');
  checkboxes.forEach(checkbox => {
    const [from, to] = checkbox.value.split(':');
    substitutions.push({ from, to });
  });

  // Update original word display
  originalWordSpan.textContent = inputText;

  // Convert to leet speak
  let leetWord = inputText.toUpperCase();

  // Apply substitutions
  substitutions.forEach(sub => {
    const regex = new RegExp(sub.from, 'gi');
    leetWord = leetWord.replace(regex, sub.to);
  });

  // Update converted word display
  convertedWordSpan.textContent = leetWord;

  // Validate the converted word
  validateLeetWord(leetWord);
}

// Function to validate the converted leet word
function validateLeetWord(leetWord) {
  const validationDiv = document.getElementById('leetValidation');
  const addButton = document.getElementById('addLeetWordBtn');

  // Check if it's a valid hex word
  if (!isValidHexWord(leetWord)) {
    validationDiv.textContent = 'Not a valid hex word! Must only contain characters 0-9 and A-F, and be 4 characters long.';
    validationDiv.className = 'leet-validation invalid';
    return;
  }

  // Check if it's already in the wordlist
  if (currentWordlist.includes(leetWord)) {
    validationDiv.textContent = 'This word is already in your wordlist!';
    validationDiv.className = 'leet-validation warning';
    return;
  }

  // Check if it's in the blacklist
  if (currentBlacklist.includes(leetWord)) {
    validationDiv.textContent = 'This word is in your blacklist!';
    validationDiv.className = 'leet-validation invalid';
    return;
  }

  // If we got here, the word is valid
  validationDiv.textContent = 'Valid hex word! Ready to add to your wordlist.';
  validationDiv.className = 'leet-validation valid';
  currentLeetWord = leetWord;
  addButton.disabled = false;
}

// Function to add the current leet word to the wordlist
function addCurrentLeetWord() {
  if (!currentLeetWord) {
    return;
  }

  // Add to wordlist
  currentWordlist.push(currentLeetWord);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update the wordlist display
  updateWordlistDisplay();

  // Add to recent leet words display
  addToRecentLeetWords(currentLeetWord);

  // Clear the input and reset
  document.getElementById('leetInput').value = '';
  document.getElementById('originalWord').textContent = '-';
  document.getElementById('convertedWord').textContent = '-';

  const validationDiv = document.getElementById('leetValidation');
  validationDiv.textContent = 'Word added successfully!';
  validationDiv.className = 'leet-validation valid';

  // Store the word for feedback before resetting
  const addedWord = currentLeetWord;

  // Disable the add button and reset current leet word
  document.getElementById('addLeetWordBtn').disabled = true;
  currentLeetWord = null;

  // Provide feedback in the generator tab
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${addedWord}" to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Function to add a word to the recent leet words display
function addToRecentLeetWords(word) {
  const container = document.getElementById('recentLeetWords');

  // Remove empty message if present
  const emptyMessage = container.querySelector('.empty-message');
  if (emptyMessage) {
    emptyMessage.remove();
  }

  // Create a new word chip
  const chip = document.createElement('div');
  chip.classList.add('word-chip');

  const wordText = document.createElement('span');
  wordText.classList.add('word-chip-text');
  wordText.textContent = word;

  chip.appendChild(wordText);

  // Add to the beginning of the container
  if (container.firstChild) {
    container.insertBefore(chip, container.firstChild);
  } else {
    container.appendChild(chip);
  }

  // Limit to 20 recent words
  const chips = container.querySelectorAll('.word-chip');
  if (chips.length > 20) {
    container.removeChild(chips[chips.length - 1]);
  }
}

// Function to handle tab switching
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("active");
  }

  const tablinks = document.getElementsByClassName("tab");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");

  // If switching to the wordlist tab, adjust container heights
  if (tabName === 'wordsTab') {
    setTimeout(adjustContainerHeights, 0);
  }
}

// Function to toggle accordions
function toggleAccordion(element) {
  element.parentElement.classList.toggle('accordion-expanded');
}

// Function to adjust container heights
function adjustContainerHeights() {
  // We're using fixed heights in CSS now, so this function is simpler
  // Both containers will have the same height (300px) as defined in CSS
  // This ensures consistent sizing between the wordlist and blacklist containers

  // If we need to adjust heights dynamically in the future, we can modify this function
}

function updateWordlistDisplay(filter = '') {
  const container = document.getElementById('wordlistDisplay');
  container.innerHTML = '';

  // Update count badge
  const countBadge = document.getElementById('wordlistCount');
  countBadge.textContent = currentWordlist.length;

  if (currentWordlist.length === 0) {
    container.innerHTML = '<div style="color: var(--error-color);">No words in list</div>';
    // Adjust container heights after updating content
    setTimeout(adjustContainerHeights, 0);
    return;
  }

  // Filter words if a search term is provided
  const displayWords = filter ?
    currentWordlist.filter(word => word.includes(filter.toUpperCase())) :
    currentWordlist;

  // Show filtered count if filtering
  if (filter && displayWords.length < currentWordlist.length) {
    countBadge.textContent = `${displayWords.length}/${currentWordlist.length}`;
  } else {
    countBadge.textContent = currentWordlist.length;
  }

  // Set up container as a drop zone
  setupDropZone(container, 'wordlist');

  displayWords.forEach(word => {
    const chip = document.createElement('div');
    chip.classList.add('word-chip', 'draggable');
    chip.setAttribute('draggable', 'false'); // Start with draggable false
    chip.setAttribute('data-word', word);
    chip.setAttribute('data-source', 'wordlist');

    // Highlight the matching part if filtering
    if (filter && word.includes(filter.toUpperCase())) {
      const matchIndex = word.indexOf(filter.toUpperCase());
      const beforeMatch = word.substring(0, matchIndex);
      const match = word.substring(matchIndex, matchIndex + filter.length);
      const afterMatch = word.substring(matchIndex + filter.length);

      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');

      if (beforeMatch) {
        const beforeSpan = document.createElement('span');
        beforeSpan.textContent = beforeMatch;
        wordText.appendChild(beforeSpan);
      }

      const matchSpan = document.createElement('span');
      matchSpan.textContent = match;
      matchSpan.classList.add('highlight-match');
      wordText.appendChild(matchSpan);

      if (afterMatch) {
        const afterSpan = document.createElement('span');
        afterSpan.textContent = afterMatch;
        wordText.appendChild(afterSpan);
      }

      chip.appendChild(wordText);
    } else {
      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');
      wordText.textContent = word;
      chip.appendChild(wordText);
    }

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-word');
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove from wordlist';
    removeBtn.onclick = function(e) {
      e.stopPropagation();
      removeWordFromList(word);
    };

    chip.appendChild(removeBtn);
    container.appendChild(chip);

    // Set up drag events
    setupDragEvents(chip);
  });

  // Update stats
  updateStats();

  // Adjust container heights after updating content
  setTimeout(adjustContainerHeights, 0);
}

function updateBlacklistDisplay(filter = '') {
  const container = document.getElementById('blacklistDisplay');
  container.innerHTML = '';

  // Update count badge
  const countBadge = document.getElementById('blacklistCount');
  countBadge.textContent = currentBlacklist.length;

  if (currentBlacklist.length === 0) {
    container.innerHTML = '<div style="color: var(--accent-color);">No blacklisted words</div>';
    // Adjust container heights after updating content
    setTimeout(adjustContainerHeights, 0);
    return;
  }

  // Filter words if a search term is provided
  const displayWords = filter ?
    currentBlacklist.filter(word => word.includes(filter.toUpperCase())) :
    currentBlacklist;

  // Show filtered count if filtering
  if (filter && displayWords.length < currentBlacklist.length) {
    countBadge.textContent = `${displayWords.length}/${currentBlacklist.length}`;
  } else {
    countBadge.textContent = currentBlacklist.length;
  }

  // Set up container as a drop zone
  setupDropZone(container, 'blacklist');

  displayWords.forEach(word => {
    const chip = document.createElement('div');
    chip.classList.add('word-chip', 'blacklist-chip', 'draggable');
    chip.setAttribute('draggable', 'false'); // Start with draggable false
    chip.setAttribute('data-word', word);
    chip.setAttribute('data-source', 'blacklist');

    // Highlight the matching part if filtering
    if (filter && word.includes(filter.toUpperCase())) {
      const matchIndex = word.indexOf(filter.toUpperCase());
      const beforeMatch = word.substring(0, matchIndex);
      const match = word.substring(matchIndex, matchIndex + filter.length);
      const afterMatch = word.substring(matchIndex + filter.length);

      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');

      if (beforeMatch) {
        const beforeSpan = document.createElement('span');
        beforeSpan.textContent = beforeMatch;
        wordText.appendChild(beforeSpan);
      }

      const matchSpan = document.createElement('span');
      matchSpan.textContent = match;
      matchSpan.classList.add('highlight-match');
      wordText.appendChild(matchSpan);

      if (afterMatch) {
        const afterSpan = document.createElement('span');
        afterSpan.textContent = afterMatch;
        wordText.appendChild(afterSpan);
      }

      chip.appendChild(wordText);
    } else {
      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');
      wordText.textContent = word;
      chip.appendChild(wordText);
    }

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-word');
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove from blacklist';
    removeBtn.onclick = function(e) {
      e.stopPropagation();
      removeWordFromBlacklist(word);
    };

    chip.appendChild(removeBtn);
    container.appendChild(chip);

    // Set up drag events
    setupDragEvents(chip);
  });

  // Adjust container heights after updating content
  setTimeout(adjustContainerHeights, 0);
}

function updateStats() {
  // Calculate the number of possible unique addresses
  // For n words, with 8 segments, if we allow repeats: n^8 possible combinations
  // If we don't allow repeats (unique words only): n!/(n-8)! if n>=8, or 0 if n<8
  const wordCount = currentWordlist.length;

  // Calculate total possible addresses (with repeats)
  const totalPossible = Math.pow(wordCount, 8);

  // Format the number in scientific notation
  let formattedNumber;
  if (totalPossible > 1e6) {
    const exponent = Math.floor(Math.log10(totalPossible));
    const mantissa = totalPossible / Math.pow(10, exponent);
    formattedNumber = `${mantissa.toFixed(2)}×10^${exponent}`;
  } else {
    formattedNumber = totalPossible.toLocaleString();
  }

  // Calculate comparison to IPv4 (which has 2^32 = 4,294,967,296 addresses)
  const ipv4Count = 4294967296;
  const timesMoreThanIpv4 = totalPossible / ipv4Count;

  let comparisonText = '';
  if (timesMoreThanIpv4 > 1) {
    if (timesMoreThanIpv4 > 1e6) {
      const exponent = Math.floor(Math.log10(timesMoreThanIpv4));
      const mantissa = timesMoreThanIpv4 / Math.pow(10, exponent);
      comparisonText = ` That's ${mantissa.toFixed(2)}×10^${exponent} times more than IPv4! 🔥`;
    } else {
      comparisonText = ` That's ${Math.round(timesMoreThanIpv4).toLocaleString()} times more than IPv4! 🔥`;
    }
  }

  // Create the stats message
  const statsMessage = `Available Hex Words: ${wordCount} (${formattedNumber} possible unique addresses.${comparisonText})`;

  // Update stats in generator tab
  const statsElement = document.getElementById('stats');
  if (statsElement) {
    statsElement.textContent = statsMessage;
  }

  // Update stats in wordlist tab
  const wordlistStatsElement = document.getElementById('wordlistStats');
  if (wordlistStatsElement) {
    wordlistStatsElement.textContent = statsMessage;
  }

  // Update leet stats
  const leetStats = document.getElementById('leetStats');
  if (leetStats && validLeetWords.length > 0) {
    leetStats.textContent = `Valid Hex Words Found: ${validLeetWords.length}`;
  } else if (leetStats) {
    leetStats.textContent = '';
  }
}

function updateWordlist() {
  const textarea = document.getElementById('customWordInput');
  const words = parseWordsFromText(textarea.value);

  if (words.length === 0) {
    alert('No valid hex words found. Words must only contain characters 0-9 and A-F, and be 4 characters long.');
    return;
  }

  // Store original words for comparison
  const originalWords = [...words];

  // Always apply blacklist filter to ensure no blacklisted words are in the wordlist
  const filteredWords = filterBlacklistedWords(words);
  currentWordlist = filteredWords;

  // Check if any words were filtered out
  const filteredOutWords = originalWords.filter(word => !filteredWords.includes(word));

  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  let message = `# Wordlist updated with ${currentWordlist.length} valid hex words.\n`;

  if (filteredOutWords.length > 0) {
    message += `# ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's were' : ' was'} filtered out: ${filteredOutWords.join(', ')}.\n`;
  }

  output.innerHTML = message;

  // Switch to generator tab
  openTab({ currentTarget: document.querySelector('.tab:first-child') }, 'generatorTab');
}

function updateBlacklist() {
  const textarea = document.getElementById('blacklistInput');
  const newBlacklistWords = textarea.value.split(/[\s\n]+/)
    .map(word => word.trim().toUpperCase())
    .filter(word => word && isValidHexWord(word));

  // Find words that are being removed from the blacklist
  const removedFromBlacklist = currentBlacklist.filter(word => !newBlacklistWords.includes(word));

  // Save the new blacklist state
  const oldBlacklist = [...currentBlacklist]; // Keep a copy of the old blacklist
  currentBlacklist = [...new Set(newBlacklistWords)]; // Remove duplicates
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));
  updateBlacklistDisplay();

  // Handle words removed from blacklist
  let addedToWordlist = [];
  if (removedFromBlacklist.length > 0 && document.getElementById('addRemovedWordsCheckbox').checked) {
    // Add words removed from blacklist to the wordlist
    const wordsToAdd = removedFromBlacklist.filter(word => !currentWordlist.includes(word));
    if (wordsToAdd.length > 0) {
      addedToWordlist = [...wordsToAdd]; // Keep track of added words
      currentWordlist = [...currentWordlist, ...wordsToAdd];
      localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

      // Update the textarea
      document.getElementById('customWordInput').value = currentWordlist.join('\n');
    }
  }

  // Count blacklisted words in the current wordlist
  const blacklistedWordsInList = currentWordlist.filter(word => currentBlacklist.includes(word));
  const blacklistedCount = blacklistedWordsInList.length;

  // Apply blacklist filter if auto-apply is checked
  if (document.getElementById('applyBlacklistCheckbox').checked && blacklistedCount > 0) {
    // Apply the filter to remove blacklisted words
    currentWordlist = filterBlacklistedWords(currentWordlist);

    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

    // Update the textarea and display
    document.getElementById('customWordInput').value = currentWordlist.join('\n');
  }

  // Update the display
  updateWordlistDisplay();

  // Prepare feedback message
  let message = '';

  // Blacklist changes
  const addedToBlacklist = currentBlacklist.filter(word => !oldBlacklist.includes(word));

  if (addedToBlacklist.length > 0) {
    message += `# Added ${addedToBlacklist.length} word${addedToBlacklist.length !== 1 ? 's' : ''} to blacklist: ${addedToBlacklist.join(', ')}.\n`;
  }

  if (removedFromBlacklist.length > 0) {
    message += `# Removed ${removedFromBlacklist.length} word${removedFromBlacklist.length !== 1 ? 's' : ''} from blacklist: ${removedFromBlacklist.join(', ')}.\n`;

    if (addedToWordlist.length > 0) {
      message += `# Added ${addedToWordlist.length} previously blacklisted word${addedToWordlist.length !== 1 ? 's' : ''} to wordlist: ${addedToWordlist.join(', ')}.\n`;
    }
  }

  // Filtered words
  if (blacklistedCount > 0 && document.getElementById('applyBlacklistCheckbox').checked) {
    message += `# Filtered ${blacklistedCount} blacklisted word${blacklistedCount !== 1 ? 's' : ''} from wordlist: ${blacklistedWordsInList.join(', ')}.\n`;
  }

  if (message === '') {
    message = '# Blacklist updated. No changes detected.\n';
  }

  message += `# Current wordlist has ${currentWordlist.length} words.\n`;

  // Show the feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = message;
  }
}

function applyBlacklistFilter() {
  // Find blacklisted words in the current wordlist
  const blacklistedWordsInList = currentWordlist.filter(word => currentBlacklist.includes(word));
  const blacklistedCount = blacklistedWordsInList.length;

  if (blacklistedCount === 0) {
    // No blacklisted words to remove
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `# No blacklisted words found in your current wordlist. Nothing to remove.\n`;
    }
    return;
  }

  // Apply the filter to remove blacklisted words
  currentWordlist = filterBlacklistedWords(currentWordlist);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update the textarea
  document.getElementById('customWordInput').value = currentWordlist.join('\n');

  // Update display
  updateWordlistDisplay();

  // Provide detailed feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Blacklist applied: Removed ${blacklistedCount} word${blacklistedCount !== 1 ? 's' : ''}: ${blacklistedWordsInList.join(', ')}.\n# ${currentWordlist.length} words remaining.\n`;
  }
}

function filterBlacklistedWords(wordlist) {
  return wordlist.filter(word => !currentBlacklist.includes(word));
}

// Debounce timer for confetti
let confettiTimer = null;

// Function to trigger confetti explosion from sides of screen
function triggerConfetti(_, y) {
  // If a confetti animation is already in progress, don't start another one
  if (confettiTimer !== null) return;

  // Configure confetti with Mexican-themed colors
  const colors = [
    '#FF0000', // Red
    '#00AA13', // Green
    '#FFFFFF', // White
    '#FFC800', // Gold/Yellow
    '#FF6600'  // Orange
  ];

  // Calculate target Y position (normalized) based on click position
  // This ensures confetti aims toward the clicked area
  const targetY = y / window.innerHeight;

  // Left side confetti
  confetti({
    particleCount: 50,
    angle: 60, // Angle from left side
    spread: 40,
    origin: { x: 0, y: targetY },
    colors: colors,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.0,
    shapes: ['square', 'circle']
  });

  // Right side confetti
  confetti({
    particleCount: 50,
    angle: 120, // Angle from right side (180 - 60)
    spread: 40,
    origin: { x: 1, y: targetY },
    colors: colors,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.0,
    shapes: ['square', 'circle']
  });

  // Set debounce timer to prevent excessive confetti
  confettiTimer = setTimeout(() => {
    confettiTimer = null;
  }, 1000); // 1 second cooldown
}

function resetToDefaultWords() {
  currentWordlist = [...DEFAULT_WORDS];
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  output.innerHTML = '# Wordlist reset to default values.\n';
}

function isValidHexWord(word) {
  return hexPattern.test(word);
}

function parseWordsFromText(text) {
  // Split by any whitespace (spaces, tabs, newlines)
  // Also handle commas and other common separators
  return text.split(/[\s\n,;:]+/)
    .map(word => {
      // Remove any special characters and trim
      return word.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    })
    .filter(word => word && isValidHexWord(word));
}

// Setup search input event listeners
function setupSearchListeners() {
  const unifiedSearch = document.getElementById('unifiedSearch');
  const searchValidation = document.getElementById('searchValidation');

  // Unified search
  unifiedSearch.addEventListener('input', function() {
    const searchTerm = this.value.trim().toUpperCase();
    updateWordlistDisplay(searchTerm);
    updateBlacklistDisplay(searchTerm);

    // Validate the search term
    validateSearchTerm(searchTerm);

    // Check if we need to show a suggestion
    if (searchTerm && isValidHexWord(searchTerm) &&
        !currentWordlist.includes(searchTerm) &&
        !currentBlacklist.includes(searchTerm)) {
      showSuggestion(searchTerm);
    } else {
      hideSuggestion();
    }
  });

  // Add word on Enter key
  unifiedSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const searchTerm = this.value.trim().toUpperCase();
      if (searchTerm && isValidHexWord(searchTerm)) {
        if (!currentWordlist.includes(searchTerm) && !currentBlacklist.includes(searchTerm)) {
          addWordToList(searchTerm);
        } else if (currentWordlist.includes(searchTerm)) {
          searchValidation.textContent = 'This word is already in your wordlist!';
          searchValidation.className = 'search-validation warning';
        } else if (currentBlacklist.includes(searchTerm)) {
          searchValidation.textContent = 'This word is in your blacklist!';
          searchValidation.className = 'search-validation invalid';
        }
      } else if (searchTerm) {
        searchValidation.textContent = 'Not a valid hex word! Must only contain characters 0-9 and A-F, and be 4 characters long.';
        searchValidation.className = 'search-validation invalid';
      }
    }
  });
}

// Function to check if a word might be leetable
function isPotentiallyLeetable(word) {
  // Characters that aren't valid hex but could be converted to leet
  const nonHexChars = ['H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'U', 'V', 'W', 'X', 'Y'];

  // Check if the word is 4 characters long
  if (word.length !== 4) return false;

  // Check if the word contains any non-hex characters that could be converted
  for (const char of word.toUpperCase()) {
    if (nonHexChars.includes(char)) return true;
  }

  return false;
}

// Function to open the Leet tab
function openLeetTab() {
  // Find the leet tab and click it
  const leetTab = document.querySelector('.tab[onclick="openTab(event, \'leetTab\')"]');
  if (leetTab) {
    leetTab.click();

    // Set the leet input to the current search term
    const searchInput = document.getElementById('unifiedSearch');
    const leetInput = document.getElementById('leetInput');
    if (searchInput && leetInput) {
      leetInput.value = searchInput.value.trim();
      convertLeetRealtime(); // Trigger conversion
    }
  }
}

// Validate search term
function validateSearchTerm(term) {
  const searchValidation = document.getElementById('searchValidation');

  // Clear validation if empty
  if (!term) {
    searchValidation.textContent = '';
    searchValidation.className = 'search-validation';
    return;
  }

  // Check if it's a valid hex word
  if (!isValidHexWord(term)) {
    if (term.length !== 4) {
      searchValidation.textContent = 'Word must be exactly 4 characters long';
    } else {
      // Check if the word might be leetable
      if (isPotentiallyLeetable(term)) {
        searchValidation.innerHTML = 'Word must only contain characters 0-9 and A-F. <a href="#" onclick="openLeetTab(); return false;">Try Leet Converter?</a>';
      } else {
        searchValidation.textContent = 'Word must only contain characters 0-9 and A-F';
      }
    }
    searchValidation.className = 'search-validation invalid';
    return;
  }

  // Check if it's already in the wordlist
  if (currentWordlist.includes(term)) {
    searchValidation.textContent = 'This word is already in your wordlist';
    searchValidation.className = 'search-validation warning';
    return;
  }

  // Check if it's in the blacklist
  if (currentBlacklist.includes(term)) {
    searchValidation.textContent = 'This word is in your blacklist';
    searchValidation.className = 'search-validation invalid';
    return;
  }

  // If we got here, the word is valid
  searchValidation.textContent = 'Valid hex word! Press Enter to add';
  searchValidation.className = 'search-validation valid';
}

// Show suggestion for a new word
function showSuggestion(word) {
  // Check if suggestion already exists
  let suggestionExists = document.querySelector('.suggestion-chip');
  if (suggestionExists) {
    hideSuggestion();
  }

  // Create suggestion in wordlist
  const wordlistContainer = document.getElementById('wordlistDisplay');
  const suggestionChip = document.createElement('div');
  suggestionChip.classList.add('word-chip', 'suggestion-chip');
  suggestionChip.setAttribute('data-word', word);

  const wordText = document.createElement('span');
  wordText.classList.add('word-chip-text');
  wordText.textContent = word;

  const addBtn = document.createElement('span');
  addBtn.classList.add('add-word');
  addBtn.textContent = '+';
  addBtn.title = 'Add to wordlist';
  addBtn.onclick = function(e) {
    e.stopPropagation();
    addWordToList(word);
  };

  suggestionChip.appendChild(wordText);
  suggestionChip.appendChild(addBtn);

  // Add to beginning of wordlist
  if (wordlistContainer.firstChild) {
    wordlistContainer.insertBefore(suggestionChip, wordlistContainer.firstChild);
  } else {
    wordlistContainer.appendChild(suggestionChip);
  }

  // Also create suggestion in blacklist
  const blacklistContainer = document.getElementById('blacklistDisplay');
  const blacklistSuggestion = suggestionChip.cloneNode(true);
  blacklistSuggestion.querySelector('.add-word').onclick = function(e) {
    e.stopPropagation();
    addWordToBlacklist(word);
  };
  blacklistSuggestion.querySelector('.add-word').title = 'Add to blacklist';

  // Add to beginning of blacklist
  if (blacklistContainer.firstChild) {
    blacklistContainer.insertBefore(blacklistSuggestion, blacklistContainer.firstChild);
  } else {
    blacklistContainer.appendChild(blacklistSuggestion);
  }
}

// Hide suggestion
function hideSuggestion() {
  const suggestions = document.querySelectorAll('.suggestion-chip');
  suggestions.forEach(suggestion => suggestion.remove());
}

// Add a word to the wordlist
function addWordToList(wordToAdd) {
  const searchInput = document.getElementById('unifiedSearch');
  const searchValidation = document.getElementById('searchValidation');
  const word = wordToAdd || searchInput.value.trim().toUpperCase();

  if (!word) {
    return;
  }

  if (!isValidHexWord(word)) {
    searchValidation.textContent = 'Invalid hex word. Words must only contain characters 0-9 and A-F, and be 4 characters long.';
    searchValidation.className = 'search-validation invalid';
    return;
  }

  if (currentWordlist.includes(word)) {
    searchValidation.textContent = 'This word is already in your wordlist.';
    searchValidation.className = 'search-validation warning';
    return;
  }

  if (currentBlacklist.includes(word)) {
    searchValidation.textContent = 'This word is in your blacklist. Remove it from the blacklist first.';
    searchValidation.className = 'search-validation invalid';
    return;
  }

  // Add the word
  currentWordlist.push(word);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Clear the search input and validation
  searchInput.value = '';
  searchValidation.textContent = '';
  searchValidation.className = 'search-validation';

  // Update display
  updateWordlistDisplay();
  updateBlacklistDisplay();
  hideSuggestion();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Remove a word from the wordlist
function removeWordFromList(word) {
  showModal(
    'Remove Word',
    `Do you want to blacklist "${word}" to prevent it from being re-added in the future?`,
    'Yes, Blacklist It',
    'No, Just Remove',
    (shouldBlacklist) => {
      if (shouldBlacklist) {
        // Add to blacklist first
        currentBlacklist.push(word);
        localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));
        updateBlacklistDisplay();
      }

      // Remove from wordlist
      currentWordlist = currentWordlist.filter(w => w !== word);
      localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

      // Update display
      const searchTerm = document.getElementById('unifiedSearch').value.trim().toUpperCase();
      updateWordlistDisplay(searchTerm);

      // Provide feedback
      const output = document.getElementById('output');
      if (output) {
        output.innerHTML = shouldBlacklist
          ? `# "${word}" was removed and blacklisted.\n# ${currentWordlist.length} words remaining.\n`
          : `# "${word}" was removed.\n# ${currentWordlist.length} words remaining.\n`;
      }

      // Trigger confetti for visual feedback
      triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }
  );
}

// Add a word to the blacklist
function addWordToBlacklist(wordToAdd) {
  const searchInput = document.getElementById('unifiedSearch');
  const searchValidation = document.getElementById('searchValidation');
  const word = wordToAdd || searchInput.value.trim().toUpperCase();

  if (!word) {
    return;
  }

  if (!isValidHexWord(word)) {
    searchValidation.textContent = 'Invalid hex word. Words must only contain characters 0-9 and A-F, and be 4 characters long.';
    searchValidation.className = 'search-validation invalid';
    return;
  }

  if (currentBlacklist.includes(word)) {
    searchValidation.textContent = 'This word is already in your blacklist.';
    searchValidation.className = 'search-validation warning';
    return;
  }

  // Add the word to blacklist
  currentBlacklist.push(word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Remove from wordlist if present
  if (currentWordlist.includes(word)) {
    currentWordlist = currentWordlist.filter(w => w !== word);
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay();
  }

  // Clear the search input and validation
  searchInput.value = '';
  searchValidation.textContent = '';
  searchValidation.className = 'search-validation';

  // Update display
  updateBlacklistDisplay();
  hideSuggestion();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your blacklist.\n# Total of ${currentBlacklist.length} blacklisted words.\n`;
  }
}

// Remove a word from the blacklist
function removeWordFromBlacklist(word) {
  currentBlacklist = currentBlacklist.filter(w => w !== word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Update display
  const searchTerm = document.getElementById('unifiedSearch').value.trim().toUpperCase();
  updateBlacklistDisplay(searchTerm);

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Removed "${word}" from your blacklist.\n# ${currentBlacklist.length} blacklisted words remaining.\n`;
  }
}

// Clear the wordlist
function clearWordlist() {
  showModal(
    '¡Advertencia! - Warning',
    'Are you sure you want to clear your entire wordlist? This action cannot be undone.',
    'Yes, Clear All',
    'No, Keep My Words',
    (confirmed) => {
      if (confirmed) {
        currentWordlist = [];
        localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
        updateWordlistDisplay();

        // Provide feedback
        const output = document.getElementById('output');
        if (output) {
          output.innerHTML = '# Wordlist cleared. All words have been removed.\n';
        }
      }
    }
  );
}

// Clear the blacklist
function clearBlacklist() {
  showModal(
    '¡Advertencia! - Warning',
    'Are you sure you want to clear your entire blacklist? This action cannot be undone.',
    'Yes, Clear All',
    'No, Keep Blacklist',
    (confirmed) => {
      if (confirmed) {
        currentBlacklist = [];
        localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));
        updateBlacklistDisplay();

        // Provide feedback
        const output = document.getElementById('output');
        if (output) {
          output.innerHTML = '# Blacklist cleared. All words have been removed.\n';
        }
      }
    }
  );
}

// Reset blacklist to defaults
function resetToDefaultBlacklist() {
  currentBlacklist = [...DEFAULT_BLACKLIST];
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Apply blacklist to wordlist
  currentWordlist = filterBlacklistedWords(currentWordlist);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update displays
  updateBlacklistDisplay();
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = '# Blacklist reset to default values.\n';
  }
}

// Add all missing words from search
function addAllMissingWords() {
  const searchInput = document.getElementById('wordlistSearch');
  const word = searchInput.value.trim().toUpperCase();

  if (!word || !isValidHexWord(word) || currentWordlist.includes(word) || currentBlacklist.includes(word)) {
    return;
  }

  // Add the word
  currentWordlist.push(word);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Clear the search input
  searchInput.value = '';

  // Update display
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Add all missing words to blacklist from search
function addAllMissingToBlacklist() {
  const searchInput = document.getElementById('blacklistSearch');
  const word = searchInput.value.trim().toUpperCase();

  if (!word || !isValidHexWord(word) || currentBlacklist.includes(word)) {
    return;
  }

  // Add the word to blacklist
  currentBlacklist.push(word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Remove from wordlist if present
  if (currentWordlist.includes(word)) {
    currentWordlist = currentWordlist.filter(w => w !== word);
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay();
  }

  // Clear the search input
  searchInput.value = '';

  // Update display
  updateBlacklistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your blacklist.\n# Total of ${currentBlacklist.length} blacklisted words.\n`;
  }
}

// Remove filtered words from wordlist
function removeFilteredWords() {
  const searchInput = document.getElementById('wordlistSearch');
  const filter = searchInput.value.trim().toUpperCase();

  if (!filter) {
    return;
  }

  // Get filtered words
  const filteredWords = currentWordlist.filter(word => word.includes(filter));

  if (filteredWords.length === 0) {
    return;
  }

  if (confirm(`Are you sure you want to remove ${filteredWords.length} filtered word(s) from your wordlist?`)) {
    // Remove filtered words
    currentWordlist = currentWordlist.filter(word => !word.includes(filter));
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

    // Clear the search input
    searchInput.value = '';

    // Update display
    updateWordlistDisplay();

    // Provide feedback
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `# Removed ${filteredWords.length} filtered word(s) from your wordlist.\n# ${currentWordlist.length} words remaining.\n`;
    }
  }
}

// Remove filtered words from blacklist
function removeFilteredFromBlacklist() {
  const searchInput = document.getElementById('blacklistSearch');
  const filter = searchInput.value.trim().toUpperCase();

  if (!filter) {
    return;
  }

  // Get filtered words
  const filteredWords = currentBlacklist.filter(word => word.includes(filter));

  if (filteredWords.length === 0) {
    return;
  }

  if (confirm(`Are you sure you want to remove ${filteredWords.length} filtered word(s) from your blacklist?`)) {
    // Remove filtered words
    currentBlacklist = currentBlacklist.filter(word => !word.includes(filter));
    localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

    // Clear the search input
    searchInput.value = '';

    // Update display
    updateBlacklistDisplay();

    // Provide feedback
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `# Removed ${filteredWords.length} filtered word(s) from your blacklist.\n# ${currentBlacklist.length} blacklisted words remaining.\n`;
    }
  }
}

// Drag and drop functionality

// Global variables for drag state
let isDragging = false;
let draggedWord = null;
let draggedSource = null;
let wordlistHighlight = null;
let blacklistHighlight = null;
let globalOverlay = null;

// Initialize drag and drop functionality
function initDragAndDrop() {
  // Create global overlay container
  globalOverlay = document.createElement('div');
  globalOverlay.classList.add('global-dropzone-overlay');
  document.body.appendChild(globalOverlay);

  // Create wordlist highlight
  wordlistHighlight = document.createElement('div');
  wordlistHighlight.classList.add('dropzone-highlight', 'wordlist-highlight');
  wordlistHighlight.innerHTML = '✅'; // Checkmark

  // Create blacklist highlight
  blacklistHighlight = document.createElement('div');
  blacklistHighlight.classList.add('dropzone-highlight', 'blacklist-highlight');
  blacklistHighlight.innerHTML = '🚫'; // Prohibition sign

  // Add global event listeners for drag and drop
  document.addEventListener('dragover', handleGlobalDragOver);
  document.addEventListener('dragend', handleGlobalDragEnd);
  document.addEventListener('drop', handleGlobalDrop);
}

// Set up drag events for a draggable item
function setupDragEvents(element) {
  // Use mousedown to prevent interference with click events
  element.addEventListener('mousedown', function(e) {
    // Only start drag if it's not the remove button
    if (!e.target.classList.contains('remove-word')) {
      element.setAttribute('draggable', 'true');
    }
  });

  // Touch support for mobile
  element.addEventListener('touchstart', function(e) {
    // Only start drag if it's not the remove button
    if (!e.target.classList.contains('remove-word')) {
      element.setAttribute('draggable', 'true');
    }
  }, { passive: true });

  // After drag or if mouse/touch is released, disable draggable
  element.addEventListener('mouseup', function() {
    setTimeout(() => {
      element.setAttribute('draggable', 'false');
    }, 100); // Small delay to allow click events to fire first
  });

  element.addEventListener('touchend', function() {
    setTimeout(() => {
      element.setAttribute('draggable', 'false');
    }, 100); // Small delay to allow click events to fire first
  }, { passive: true });

  element.addEventListener('dragstart', handleDragStart);
}

// Set up drop zone for a container
function setupDropZone(container, type) {
  // Store the container type
  container.setAttribute('data-container-type', type);
}

// Handle drag start event
function handleDragStart(e) {
  // Set drag state
  isDragging = true;
  draggedWord = this.getAttribute('data-word');
  draggedSource = this.getAttribute('data-source');

  // Add dragging class for visual feedback
  this.classList.add('dragging');

  // Set the drag data
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', JSON.stringify({
    word: draggedWord,
    source: draggedSource
  }));

  // Set a custom drag image (optional)
  const dragImage = this.cloneNode(true);
  dragImage.style.opacity = '0.7';
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px';
  document.body.appendChild(dragImage);
  e.dataTransfer.setDragImage(dragImage, 0, 0);

  // Remove the clone after a short delay
  setTimeout(() => {
    document.body.removeChild(dragImage);
  }, 0);

  // Show the global overlay
  globalOverlay.style.display = 'block';

  // Add highlights to appropriate containers
  updateDropzoneHighlights();
}

// Handle global drag over event
function handleGlobalDragOver(e) {
  if (!isDragging) return;
  e.preventDefault();

  // Get element under pointer
  const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  if (!elemBelow) return;

  // Find the container element
  const wordlistContainer = document.getElementById('wordlistDisplay');
  const blacklistContainer = document.getElementById('blacklistDisplay');

  // Check if we're over a valid container
  const wordlistRect = wordlistContainer.getBoundingClientRect();
  const blacklistRect = blacklistContainer.getBoundingClientRect();

  // Check if pointer is over wordlist container
  const overWordlist =
    e.clientX >= wordlistRect.left &&
    e.clientX <= wordlistRect.right &&
    e.clientY >= wordlistRect.top &&
    e.clientY <= wordlistRect.bottom;

  // Check if pointer is over blacklist container
  const overBlacklist =
    e.clientX >= blacklistRect.left &&
    e.clientX <= blacklistRect.right &&
    e.clientY >= blacklistRect.top &&
    e.clientY <= blacklistRect.bottom;

  // Update highlights based on position
  if (overWordlist && draggedSource !== 'wordlist') {
    // Position the highlight over the wordlist container
    positionHighlight(wordlistHighlight, wordlistContainer);
    wordlistHighlight.classList.add('active');
  } else {
    wordlistHighlight.classList.remove('active');
  }

  if (overBlacklist && draggedSource !== 'blacklist') {
    // Position the highlight over the blacklist container
    positionHighlight(blacklistHighlight, blacklistContainer);
    blacklistHighlight.classList.add('active');
  } else {
    blacklistHighlight.classList.remove('active');
  }
}

// Position a highlight element over a container
function positionHighlight(highlight, container) {
  const rect = container.getBoundingClientRect();
  highlight.style.position = 'fixed';
  highlight.style.left = rect.left + 'px';
  highlight.style.top = rect.top + 'px';
  highlight.style.width = rect.width + 'px';
  highlight.style.height = rect.height + 'px';
}

// Update dropzone highlights
function updateDropzoneHighlights() {
  // Clear existing highlights
  globalOverlay.innerHTML = '';

  // Only show appropriate highlights based on source
  if (draggedSource === 'wordlist') {
    // If dragging from wordlist, only show blacklist as target
    globalOverlay.appendChild(blacklistHighlight);
  } else if (draggedSource === 'blacklist') {
    // If dragging from blacklist, only show wordlist as target
    globalOverlay.appendChild(wordlistHighlight);
  }
}

// Handle global drag end event
function handleGlobalDragEnd() {
  resetDragState();
}

// Handle global drop event
function handleGlobalDrop(e) {
  if (!isDragging) return;
  e.preventDefault();

  // Get element under pointer
  const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  if (!elemBelow) {
    resetDragState();
    return;
  }

  // Find the container element
  const wordlistContainer = document.getElementById('wordlistDisplay');
  const blacklistContainer = document.getElementById('blacklistDisplay');

  // Check if we're over a valid container
  const wordlistRect = wordlistContainer.getBoundingClientRect();
  const blacklistRect = blacklistContainer.getBoundingClientRect();

  // Check if pointer is over wordlist container
  const overWordlist =
    e.clientX >= wordlistRect.left &&
    e.clientX <= wordlistRect.right &&
    e.clientY >= wordlistRect.top &&
    e.clientY <= wordlistRect.bottom;

  // Check if pointer is over blacklist container
  const overBlacklist =
    e.clientX >= blacklistRect.left &&
    e.clientX <= blacklistRect.right &&
    e.clientY >= blacklistRect.top &&
    e.clientY <= blacklistRect.bottom;

  // Handle drop based on container
  if (overWordlist && draggedSource === 'blacklist') {
    // Move from blacklist to wordlist
    handleMoveToWordlist(draggedWord);
  } else if (overBlacklist && draggedSource === 'wordlist') {
    // Move from wordlist to blacklist
    handleMoveToBlacklist(draggedWord);
  }

  // Reset drag state
  resetDragState();
}

// Reset drag state
function resetDragState() {
  // Reset drag state
  isDragging = false;
  draggedWord = null;
  draggedSource = null;

  // Hide highlights
  if (wordlistHighlight) wordlistHighlight.classList.remove('active');
  if (blacklistHighlight) blacklistHighlight.classList.remove('active');

  // Hide global overlay
  if (globalOverlay) globalOverlay.style.display = 'none';

  // Remove dragging class from all elements
  document.querySelectorAll('.dragging').forEach(elem => {
    elem.classList.remove('dragging');
  });
}

// Handle moving a word to the blacklist
function handleMoveToBlacklist(word) {
  // Remove from wordlist
  currentWordlist = currentWordlist.filter(w => w !== word);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Add to blacklist if not already there
  if (!currentBlacklist.includes(word)) {
    currentBlacklist.push(word);
    localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));
  }

  // Clear search input to show all words
  const searchInput = document.getElementById('unifiedSearch');
  if (searchInput) {
    searchInput.value = '';
  }

  // Update displays with no filter to show all words
  updateWordlistDisplay();
  updateBlacklistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# "${word}" was moved to the blacklist.\n`;
  }
}

// Handle moving a word to the wordlist
function handleMoveToWordlist(word) {
  // Remove from blacklist
  currentBlacklist = currentBlacklist.filter(w => w !== word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Add to wordlist if not already there
  if (!currentWordlist.includes(word)) {
    currentWordlist.push(word);
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  }

  // Clear search input to show all words
  const searchInput = document.getElementById('unifiedSearch');
  if (searchInput) {
    searchInput.value = '';
  }

  // Update displays with no filter to show all words
  updateWordlistDisplay();
  updateBlacklistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# "${word}" was moved to the wordlist.\n`;
  }
}

function handleFileUpload() {
  const fileInput = document.getElementById('wordlistFile');
  const progressBar = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('uploadProgressFill');
  const statusMsg = document.getElementById('uploadStatus');

  if (!fileInput.files.length) {
    return;
  }

  const file = fileInput.files[0];

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    statusMsg.textContent = 'File is too large. Maximum size is 5MB.';
    statusMsg.className = 'status-message error';
    return;
  }

  // Show progress bar
  progressBar.style.display = 'block';
  progressFill.style.width = '0%';
  statusMsg.textContent = 'Reading file...';
  statusMsg.className = 'status-message';

  const reader = new FileReader();

  reader.onprogress = function(event) {
    if (event.lengthComputable) {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);
      progressFill.style.width = percentLoaded + '%';
    }
  };

  reader.onload = function(event) {
    progressFill.style.width = '100%';
    statusMsg.textContent = 'Processing words...';

    const words = parseWordsFromText(event.target.result);

    // Store original words for comparison
    const originalWords = [...words];

    // Apply blacklist filter to the new words
    const filteredWords = filterBlacklistedWords(words);

    // Check if any words were filtered out
    const filteredOutWords = originalWords.filter(word => !filteredWords.includes(word));

    // Always append to current wordlist
    const newWords = filteredWords.filter(word => !currentWordlist.includes(word));
    currentWordlist = [...currentWordlist, ...newWords];

    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay(); // This already calls updateStats()
    updateBlacklistDisplay();

    // Provide more detailed feedback
    let statusMessage = `File processed: ${newWords.length} new words added`;
    if (filteredOutWords.length > 0) {
      statusMessage += `, ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's' : ''} filtered out`;
    }
    statusMessage += `. ${currentWordlist.length} total words available.`;

    statusMsg.textContent = statusMessage;
    statusMsg.className = 'status-message success';

    // Clear the file input
    fileInput.value = '';

    // Hide progress bar after 3 seconds
    setTimeout(() => {
      progressBar.style.display = 'none';
      statusMsg.textContent = '';
    }, 3000);

    // Also update the generator tab output with the results
    const output = document.getElementById('output');
    if (output) {
      let message = `# Word list updated with ${newWords.length} new words.\n`;

      if (filteredOutWords.length > 0) {
        message += `# ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's were' : ' was'} filtered out.\n`;
      }

      message += `# Total of ${currentWordlist.length} words now available.\n`;
      output.innerHTML = message;
    }
  };

  reader.readAsText(file);
}
